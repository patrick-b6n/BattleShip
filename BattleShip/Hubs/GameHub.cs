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

        private Player CurrentPlayer => _playerManager.Get(Context.ConnectionId);

        public GameHub(GameManager gameManager,
                       PlayerManager playerManager,
                       LobbyManager lobbyManager)
        {
            _gameManager = gameManager;
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        public override async Task OnConnectedAsync()
        {
            var player = _playerManager.Create(Context.ConnectionId);
            await Clients.Caller.SendAsync(Commands.Connected, new ConnectedModel { Player = PlayerModel.Map(player) });
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
            var lobby = _lobbyManager.Get(model.Id) ?? _lobbyManager.CreateLobby();

            // join new lobby
            CurrentPlayer.Join(lobby);
            await Groups.AddAsync(Context.ConnectionId, lobby.IdStr);
            await Clients.OthersInGroup(lobby.IdStr).SendAsync("PlayerJoined", CurrentPlayer);

            await LobbyChanged(lobby);
        }

        public async Task StartGame(StartGameModel model)
        {
            // TODO Check if already ingame
            var opponent = _playerManager.Get(model.Player.Id);

            var game = _gameManager.NewGame(CurrentPlayer, opponent);
            CurrentPlayer.Join(game);
            opponent.Join(game);

            await Groups.AddAsync(CurrentPlayer.Id, game.Id.ToString());
            await Groups.AddAsync(opponent.Id, game.Id.ToString());

            await Clients.Group(game.Id.ToString()).SendAsync("GameStarted", new GameStartedModel { Game = GameModel.Map(game) });
        }

        public async Task ChallengePlayer(ChallengePlayerModel model)
        {
            await Clients.Client(model.Player.Id).SendAsync("ChallengeRequest", new ChallengePlayerModel { Player = PlayerModel.Map(CurrentPlayer) });
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

    public class GameStartedModel
    {
        public GameModel Game { get; set; }
    }

    public class GameModel
    {
        public PlayerModel Player1 { get; set; }
        public PlayerModel Player2 { get; set; }
        public GamePhase GamePhase { get; set; }

        public static GameModel Map(Game game)
        {
            return new GameModel
            {
                GamePhase = game.Phase,
                Player1 = PlayerModel.Map(game.Player1),
                Player2 = PlayerModel.Map(game.Player2)
            };
        }
    }

    public class StartGameModel
    {
        public PlayerModel Player { get; set; }
    }

    public class ChallengePlayerModel
    {
        public PlayerModel Player { get; set; }
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
        public PlayerModel Player { get; set; }
    }

    public class PlayerModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public static PlayerModel Map(Player player)
        {
            return new PlayerModel { Id = player.Id, Name = player.Name };
        }
    }
}