using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BattleShip.Domain;
using BattleShip.Domain.Entity;
using Microsoft.AspNetCore.SignalR;

namespace BattleShip.Hubs
{
    public static class Extensions
    {
        public static Task RemoveFromGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName, CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.RemoveFromGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static Task AddToGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName, CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.AddToGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static T OthersInGroup<T>(this IHubCallerClients<T> callerClients, Guid groupName)
        {
            return callerClients.OthersInGroup(groupName.ToString());
        }
    }

    public class GameHub2 : Hub
    {
        private class Commands
        {
            public const string Connected = "Connected";
            public const string LobbyJoined = "LobbyJoined";
            public const string PlayerJoinedLobby = "PlayerJoinedLobby";
            public const string PlayerLeftLobby = "PlayerLeftLobby";
        }

        private readonly PlayerManager _playerManager;
        private readonly LobbyManager _lobbyManager;
        private Player CurrentPlayer => _playerManager.Get(Context.ConnectionId).Item2;

        public GameHub2(PlayerManager playerManager, LobbyManager lobbyManager)
        {
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
        }

        public async void Connect(ConnectModel model)
        {
            var player = _playerManager.Create(Context.ConnectionId, model.Name);
            await Clients.Client(player.ConnectionId).SendAsync(Commands.Connected, new ConnectedModel2 { Player = PlayerModel2.Map(player) });
        }

        public async Task JoinLobby(Guid lobbyId)
        {
            if (CurrentPlayer.Lobby != null)
            {
                CurrentPlayer.LeaveLobby();

                await Groups.RemoveFromGroupAsync(CurrentPlayer.ConnectionId, CurrentPlayer.Lobby.Id);
                await Clients.OthersInGroup(CurrentPlayer.Lobby.Id).SendAsync(Commands.PlayerLeftLobby, PlayerModel2.Map(CurrentPlayer));
            }

            var (getLobbyResult, lobby) = _lobbyManager.Get(lobbyId);
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
            await Clients.Client(CurrentPlayer.ConnectionId).SendAsync(Commands.LobbyJoined, LobbyModel2.Map(lobby));
            await Clients.OthersInGroup(lobby.Id).SendAsync(Commands.PlayerJoinedLobby, PlayerModel2.Map(CurrentPlayer));
        }
    }

    public class ConnectModel
    {
        public string Name { get; set; }
    }

    public class ConnectedModel2
    {
        public PlayerModel2 Player { get; set; }
    }

    public class PlayerModel2
    {
        public Guid Id { get; set; }

        public string ConnectionId { get; set; }

        public string Name { get; set; }

        public Guid LobbyId { get; set; }

        public Guid GameId { get; set; }

        public static PlayerModel2 Map(Player player)
        {
            return new PlayerModel2
            {
                ConnectionId = player.ConnectionId,
                Id = player.Id,
                LobbyId = player.Lobby.Id,
                Name = player.Name
            };
        }
    }

    public class LobbyModel2
    {
        public Guid Id { get; set; }

        public IEnumerable<PlayerModel2> Players { get; set; }

        public static LobbyModel2 Map(Lobby lobby)
        {
            return new LobbyModel2 { Id = lobby.Id, Players = Enumerable.Empty<PlayerModel2>() };
        }
    }
}