using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BattleShip.Domain;
using Microsoft.AspNetCore.SignalR;

namespace BattleShip.Hubs
{
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
            _playerManager.Add(new Player(Context.ConnectionId));
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LobbyChanged(CurrentPlayer.LeaveLobby());
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

            await LobbyChanged(lobby);
        }

        private async Task LeaveLobby()
        {
            var oldLobby = CurrentPlayer.LeaveLobby();
            await Groups.RemoveAsync(Context.ConnectionId, oldLobby.IdStr);

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
                var model = new EnterLobbyAnswerModel()
                {
                    Id = lobby.Id,
                    Players = lobby.Players.Select(x => new PlayerModel { Id = x.Id, Name = x.Name })
                };

                await Clients.Group(lobby.Id.ToString()).SendAsync("EnterLobby", model);
            }
        }
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

    public class PlayerModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}