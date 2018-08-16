using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Threading;
using System.Threading.Tasks;
using BattleShip.Domain;
using BattleShip.Domain.Entity;
using Microsoft.AspNetCore.SignalR;

namespace BattleShip.Hubs
{
    public static class Extensions
    {
        public static Task RemoveFromGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName,
                                                CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.RemoveFromGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static Task AddToGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName,
                                           CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.AddToGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static T OthersInGroup<T>(this IHubCallerClients<T> callerClients, Guid groupName)
        {
            return callerClients.OthersInGroup(groupName.ToString());
        }
    }

    public class GameHub : Hub
    {
        private class Commands
        {
            public const string Connect = nameof(GameHub.Connect);
            public const string JoinLobby = nameof(GameHub.JoinLobby);

            public const string Connected = "Connected";
            public const string LobbyJoined = "LobbyJoined";
            public const string PlayerJoinedLobby = "PlayerJoinedLobby";
            public const string PlayerLeftLobby = "PlayerLeftLobby";
            public const string RequestMatch = "RequestMatch";
            public const string CancelRequestMatch = "CancelRequestMatch";
            public const string DeclineRequestMatch = "DeclineRequestMatch";
            public const string AcceptRequestMatch = "AcceptRequestMatch";
            public const string FireShot = "FireShot";
            public const string FireShotResponse = "FireShotResponse";
        }

        private readonly PlayerManager _playerManager;
        private readonly LobbyManager _lobbyManager;
        private Player CurrentPlayer => _playerManager.Get(Context.ConnectionId).Item2;

        public GameHub(PlayerManager playerManager, LobbyManager lobbyManager)
        {
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LeaveLobby();
        }

        public async void Connect(ConnectModel model)
        {
            var player = _playerManager.Create(Context.ConnectionId, model.Name);

            var connectedModel = new ConnectedModel
            {
                Player = PlayerModel.Map(player),
                DefaultLobbyId = _lobbyManager.DefaultLobby.Id
            };
            await Clients.Client(player.ConnectionId).SendAsync(Commands.Connected, connectedModel);
        }

        public async Task LeaveLobby()
        {
            var lobby = CurrentPlayer.LeaveLobby();

            await Groups.RemoveFromGroupAsync(CurrentPlayer.ConnectionId, lobby.Id);
            await Clients.OthersInGroup(lobby.Id).SendAsync(Commands.PlayerLeftLobby, PlayerModel.Map(CurrentPlayer));
        }

        public async Task JoinLobby(JoinLobbyModel model)
        {
            if (CurrentPlayer.Lobby != null)
            {
                CurrentPlayer.LeaveLobby();

                await Groups.RemoveFromGroupAsync(CurrentPlayer.ConnectionId, CurrentPlayer.Lobby.Id);
                await Clients.OthersInGroup(CurrentPlayer.Lobby.Id)
                             .SendAsync(Commands.PlayerLeftLobby, PlayerModel.Map(CurrentPlayer));
            }

            var (getLobbyResult, lobby) = _lobbyManager.Get(model.LobbyId);
            if (getLobbyResult.IsError)
            {
                if (getLobbyResult.ErrorType == ErrorType.NotFound)
                {
                    lobby = _lobbyManager.Create();
                }
                else
                {
                    throw new Exception(getLobbyResult.Message);
                }
            }

            CurrentPlayer.Join(lobby);

            await Groups.AddToGroupAsync(CurrentPlayer.ConnectionId, lobby.Id);
            await Clients.Client(CurrentPlayer.ConnectionId)
                         .SendAsync(Commands.LobbyJoined, new LobbyJoinedModel {Lobby = LobbyModel.Map(lobby)});
            await Clients.OthersInGroup(lobby.Id).SendAsync(Commands.PlayerJoinedLobby, PlayerModel.Map(CurrentPlayer));
        }

        public async Task RequestMatch(RequestMatchModel model)
        {
            await ForwardToPlayer(model.To.Id, model, Commands.RequestMatch);
        }

        public async Task CancelRequestMatch(RequestMatchModel model)
        {
            await ForwardToPlayer(model.To.Id, model, Commands.CancelRequestMatch);
        }

        public async Task FireShot(FireShotModel model)
        {
            await ForwardToPlayer(model.To.Id, model, Commands.FireShot);
        }

        public async Task FireShotResponse(FireShotResponseModel model)
        {
            await ForwardToPlayer(model.To.Id, model, Commands.FireShotResponse);
        }

        /**
         * Forwards denial to player who sent the request
         */
        public async Task DeclineRequestMatch(RequestMatchModel model)
        {
            await ForwardToPlayer(model.From.Id, model, Commands.DeclineRequestMatch);
        }

        /**
         * Forwards accept to player who sent the request
         */
        public async Task AcceptRequestMatch(RequestMatchModel model)
        {
            await ForwardToPlayer(model.From.Id, model, Commands.AcceptRequestMatch);
        }

        private async Task ForwardToPlayer<T>(Guid playerId, T model, string command)
        {
            var (result, player) = _playerManager.Get(playerId);

            if (result.IsSuccess)
            {
                await Clients.Clients(player.ConnectionId).SendAsync(command, model);
            }
            else
            {
                throw new Exception();
            }
        }
    }

    public class ConnectModel
    {
        public string Name { get; set; }
    }

    public class ConnectedModel
    {
        public PlayerModel Player { get; set; }

        public Guid DefaultLobbyId { get; set; }
    }

    public class JoinLobbyModel
    {
        public Guid LobbyId { get; set; }
    }

    public class LobbyJoinedModel
    {
        public LobbyModel Lobby { get; set; }
    }

    public class RequestMatchModel
    {
        public PlayerModel From { get; set; }

        public PlayerModel To { get; set; }
    }

    public class FireShotModel
    {
        public int X { get; set; }
        
        public int Y { get; set; }

        public PlayerModel To { get; set; }
    }

    public class FireShotResponseModel
    {
        public int X { get; set; }
        
        public int Y { get; set; }

        public PlayerModel To { get; set; }

        public bool IsHit { get; set; }
    }

    public class PlayerModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public static PlayerModel Map(Player player)
        {
            return new PlayerModel
            {
                Id = player.Id,
                Name = player.Name
            };
        }
    }

    public class LobbyModel
    {
        public Guid Id { get; set; }

        public IEnumerable<PlayerModel> Players { get; set; }

        public static LobbyModel Map(Lobby lobby)
        {
            return new LobbyModel {Id = lobby.Id, Players = lobby.Players.Select(PlayerModel.Map)};
        }
    }
}