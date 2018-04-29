// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global

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
        public const string ChallengeRequest = "ChallengeRequest";
        public const string Connected = "Connected";
        public const string FireShot = "FireShot";
        public const string LobbyEntered = "LobbyEntered";
        public const string PlayerChanged = "PlayerChanged";
        public const string PlayerJoined = "PlayerJoined";
        public const string PlayerLeft = "PlayerLeft";
        public const string ShotFeedback = "ShotFeedback";
        public const string ShotFired = "ShotFired";
        public const string StartGame = "StartGame";
        public const string GameState = "GameState";
    }

    public class GameHub : Hub
    {
        private readonly GameManager _gameManager;
        private readonly LobbyManager _lobbyManager;
        private readonly PlayerManager _playerManager;

        public GameHub(GameManager gameManager,
                       PlayerManager playerManager,
                       LobbyManager lobbyManager)
        {
            _gameManager = gameManager;
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        private Player CurrentPlayer => _playerManager.Get(Context.ConnectionId);

        public override async Task OnConnectedAsync()
        {
            var player = _playerManager.Create(Context.ConnectionId);
            await Clients.Caller.SendAsync(Commands.Connected, new ConnectedModel { PlayerId = player.Id });
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LeaveGame();
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
            var lobby = _lobbyManager.Get(model.LobbyId) ?? _lobbyManager.CreateLobby();

            // join new lobby
            CurrentPlayer.Join(lobby);
            await Groups.AddAsync(Context.ConnectionId, lobby.IdStr);
            await LobbyChanged(lobby);

            await Clients.OthersInGroup(lobby.IdStr).SendAsync(Commands.PlayerJoined, PlayerModel.Map(CurrentPlayer));
        }

        public async Task AcceptChallenge(AcceptChallengeModel model)
        {
            var opponent = _playerManager.Get(model.PlayerId);
            var gameId = _gameManager.NewGame(CurrentPlayer, opponent);

            var gameModel = new GameModel { GameId = gameId, Player1 = PlayerModel.Map(CurrentPlayer), Player2 = PlayerModel.Map(opponent) };

            await Clients.Client(opponent.Id).SendAsync(Commands.StartGame, new StartGameModel { Game = gameModel, FirstTurn = false });
            await Clients.Client(CurrentPlayer.Id).SendAsync(Commands.StartGame, new StartGameModel { Game = gameModel, FirstTurn = true });
        }

        public async Task ChallengePlayer(ChallengePlayerModel model)
        {
            await Clients.Client(model.PlayerId).SendAsync(Commands.ChallengeRequest, new ChallengePlayerModel { PlayerId = CurrentPlayer.Id });
        }

        private async Task LeaveLobby()
        {
            var oldLobby = CurrentPlayer.LeaveLobby();
            await Groups.RemoveAsync(Context.ConnectionId, oldLobby.IdStr);
            await Clients.Group(oldLobby.IdStr).SendAsync(Commands.PlayerLeft, PlayerModel.Map(CurrentPlayer));

            if (oldLobby.IsEmpty && oldLobby != _lobbyManager.DefaultLobby)
            {
                _lobbyManager.Remove(oldLobby);
            }
        }

        public async Task UpdatePlayer(UpdatePlayerModel model)
        {
            CurrentPlayer.ChangeName(model.Name);

            if (CurrentPlayer.Lobby != null)
            {
                await Clients.Group(CurrentPlayer.Lobby.IdStr).SendAsync(Commands.PlayerChanged, PlayerModel.Map(CurrentPlayer));
            }
        }

        public async Task LobbyChanged(Lobby lobby)
        {
            if (lobby != null)
            {
                var model = new LobbyEnteredModel
                {
                    LobbyId = lobby.Id,
                    Players = lobby.Players.Select(x => new PlayerModel { PlayerId = x.Id, Name = x.Name })
                };

                await Clients.Caller.SendAsync(Commands.LobbyEntered, model);
            }
        }

        public async Task FireShot(FireShotModel model)
        {
            var opponent = _gameManager.GetOpponent(CurrentPlayer);
            if (opponent != null)
            {
                await Clients.Client(opponent.Id).SendAsync(Commands.ShotFired, model);
            }
        }

        public async Task ShotFeedback(ShotFeedbackModel model)
        {
            var opponent = _gameManager.GetOpponent(CurrentPlayer);
            if (opponent != null)
            {
                await Clients.Client(opponent.Id).SendAsync(Commands.ShotFeedback, model);
            }
        }

        public async Task GameState(GameStateModel model)
        {
            var players = _gameManager.Get(model.GameId).ToList();
            if (players.Count == 2)
            {
                await Clients.Client(players[0].Id).SendAsync(Commands.GameState, model);
                await Clients.Client(players[1].Id).SendAsync(Commands.GameState, model);
            }
        }

        public async Task LeaveGame()
        {
            _gameManager.RemoveGame(CurrentPlayer.GameId);
        }
    }

    public class ConnectedModel
    {
        public string PlayerId { get; set; }
    }

    public class EnterLobbyModel
    {
        public Guid LobbyId { get; set; }
    }

    public class LobbyEnteredModel
    {
        public Guid LobbyId { get; set; }
        public IEnumerable<PlayerModel> Players { get; set; }
    }

    public class PlayerModel
    {
        public string PlayerId { get; set; }
        public string Name { get; set; }

        public static PlayerModel Map(Player player)
        {
            return new PlayerModel { PlayerId = player.Id, Name = player.Name };
        }
    }

    public class ChallengePlayerModel
    {
        public string PlayerId { get; set; }
    }

    public class AcceptChallengeModel
    {
        public string PlayerId { get; set; }
    }

    public class StartGameModel
    {
        public GameModel Game { get; set; }
        public bool FirstTurn { get; set; }
    }

    public class GameModel
    {
        public Guid GameId { get; set; }
        public PlayerModel Player1 { get; set; }
        public PlayerModel Player2 { get; set; }
    }

    public class UpdatePlayerModel
    {
        public string Name { get; set; }
    }

    public class FireShotModel
    {
        public int X { get; set; }
        public int Y { get; set; }
    }

    public class ShotFeedbackModel
    {
        public int X { get; set; }
        public int Y { get; set; }
        public BoardField Result { get; set; }
        public int RemainingShipCount { get; set; }
    }

    public class GameStateModel
    {
        public Guid GameId { get; set; }
        public string CurrentPlayerId { get; set; }
        public string WinnerPlayerId { get; set; }
        public bool Disconnect { get; set; }
    }

    public class LeaveGameModel
    {
        public Guid GameId { get; set; }
    }
}