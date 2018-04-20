using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BattleShip.Domain;
using Microsoft.AspNetCore.SignalR;

namespace BattleShip.Hubs
{
    public class Commands
    {
        public static string Connected = "Connected";
    }

    public class GameHub : Hub
    {
        private readonly GameManager _gameManager;
        private readonly PlayerManager _playerManager;
        private readonly LobbyManager _lobbyManager;

        public GameHub(GameManager gameManager,
                       PlayerManager playerManager,
                       LobbyManager lobbyManager)
        {
            _gameManager = gameManager;
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        public Player CurrentPlayer => _playerManager.Get(Context.ConnectionId);

        public override async Task OnConnectedAsync()
        {
            var player = new Player(Context.ConnectionId);
            _playerManager.Add(player);
            await Clients.Caller.SendAsync(Commands.Connected, new ConnectedModel { Player = player });
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LeaveLobby();
            _playerManager.Remove(CurrentPlayer);
        }

        public async Task EnterLobby(EnterLobbyModel model)
        {
            // leave current lobby
            if (CurrentPlayer.Lobby != null)
            {
                await LeaveLobby();
            }

            // get/create new lobby
            var lobby = _lobbyManager.Get(model.Id);
            if (lobby == null)
            {
                lobby = new Lobby(Guid.NewGuid());
                _lobbyManager.Add(lobby);
            }

            // join new lobby
            CurrentPlayer.Join(lobby);
            await Groups.AddAsync(Context.ConnectionId, lobby.IdStr);
            await Clients.OthersInGroup(lobby.IdStr).SendAsync("PlayerJoined", CurrentPlayer);

            await LobbyChanged(lobby);
        }

        public async Task ChallengePlayer(ChallengePlayerModel model)
        {
            await Clients.Client(model.Player.Id).SendAsync("ChallengeRequest", new ChallengePlayerModel { Player = _playerManager.Get(Context.ConnectionId) });
        }

        private async Task LeaveLobby()
        {
            var oldLobby = CurrentPlayer.LeaveLobby();
            await Groups.RemoveAsync(Context.ConnectionId, oldLobby.IdStr);
            await Clients.Group(oldLobby.IdStr).SendAsync("PlayerLeft", CurrentPlayer);

            if (oldLobby.IsEmpty && oldLobby != _lobbyManager.DefaultLobby)
            {
                _lobbyManager.Remove(oldLobby);
            }
        }

        public async Task SetPlayerName(SetPlayerNameModel model)
        {
            CurrentPlayer.ChangeName(model.Name);

            await LobbyChanged(CurrentPlayer.Lobby);
        }

        public async Task LobbyChanged(Lobby lobby)
        {
            if (lobby != null)
            {
                var model = new EnterLobbyAnswerModel
                {
                    Id = lobby.Id,
                    Players = lobby.Players.Select(x => new PlayerModel { Id = x.Id, Name = x.Name })
                };

                await Clients.Caller.SendAsync("EnterLobby", model);
            }
        }
    }

    public class ChallengePlayerModel
    {
        public Player Player { get; set; }
    }

    public class SetPlayerNameModel
    {
        public string Name { get; set; }
    }

    public class EnterLobbyModel
    {
        public Guid Id { get; set; }
    }

    public class EnterLobbyAnswerModel
    {
        public Guid Id { get; set; }
        public IEnumerable<PlayerModel> Players { get; set; }
    }

    public class ConnectedModel
    {
        public Player Player { get; set; }
    }

    public class PlayerModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}