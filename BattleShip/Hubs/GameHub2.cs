using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

        private readonly PlayerManager2 _playerManager;
        private readonly LobbyManager2 _lobbyManager;
        private PlayerManager2.Player CurrentPlayer => _playerManager.Get(Context.ConnectionId).Item2;

        public GameHub2(PlayerManager2 playerManager, LobbyManager2 lobbyManager)
        {
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        public override async Task OnConnectedAsync()
        {
            var (result, player) = _playerManager.Create(Context.ConnectionId);
            if (result.IsSuccess)
            {
                await Clients.Client(player.ConnectionId).SendAsync(Commands.Connected, new ConnectedModel2 { Player = PlayerModel2.Map(player) });
            }
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
        }

        public async Task JoinLobby(Guid lobbyId)
        {
            if (CurrentPlayer.Lobby != null)
            {
                _playerManager.LeaveLobby(CurrentPlayer);

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

            _playerManager.JoinLobby(CurrentPlayer, lobby);

            await Groups.AddToGroupAsync(CurrentPlayer.ConnectionId, lobby.Id);
            await Clients.Client(CurrentPlayer.ConnectionId).SendAsync(Commands.LobbyJoined, LobbyModel2.Map(lobby));
            await Clients.OthersInGroup(lobby.Id).SendAsync(Commands.PlayerJoinedLobby, PlayerModel2.Map(CurrentPlayer));
        }
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

        public static PlayerModel2 Map(PlayerManager2.Player player)
        {
            return new PlayerModel2
            {
                ConnectionId = player.ConnectionId,
                GameId = player.GameId,
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

        public static LobbyModel2 Map(LobbyManager2.Lobby2 lobby)
        {
            return new LobbyModel2 { Id = lobby.Id, Players = Enumerable.Empty<PlayerModel2>() };
        }
    }

    public class LobbyManager2
    {
        private readonly ConcurrentDictionary<Guid, Lobby2> _lobbies;

        public LobbyManager2()
        {
            _lobbies = new ConcurrentDictionary<Guid, Lobby2>();
        }

        public class Lobby2
        {
            private readonly List<PlayerManager2.Player> _players;

            public Lobby2()
            {
                Id = Guid.NewGuid();
                _players = new List<PlayerManager2.Player>();
            }

            public Guid Id { get; }

            public IReadOnlyCollection<PlayerManager2.Player> Players => _players;

            public void Join(PlayerManager2.Player player)
            {
                _players.Add(player);
            }

            public void Leave(PlayerManager2.Player player)
            {
                _players.Remove(player);
            }
        }

        public Lobby2 Create()
        {
            // cleanup empty lobbies
            Task.Run(() => _lobbies.Where(entry => entry.Value.Players.Count == 0).Select(entry => _lobbies.TryRemove(entry.Key, out _)));

            var lobby = new Lobby2();
            _lobbies.TryAdd(lobby.Id, lobby);

            return lobby;
        }

        public (Result, Lobby2) Get(Guid lobbyId)
        {
            if (_lobbies.TryGetValue(lobbyId, out var lobby))
            {
                return (Result.Success, lobby);
            }

            return (Result.NotFound, null);
        }
    }

    public class PlayerManager2
    {
        private readonly ConcurrentDictionary<Guid, PlayerImpl> _players;
        private readonly ConcurrentDictionary<string, Guid> _connectionIdToPlayerId;

        public PlayerManager2()
        {
            _players = new ConcurrentDictionary<Guid, PlayerImpl>();
            _connectionIdToPlayerId = new ConcurrentDictionary<string, Guid>();
        }

        public (Result, Player) Create(string connectionId)
        {
            var player = new PlayerImpl(connectionId, "");
            _players.TryAdd(player.Id, player);

            return (Result.Success, player);
        }

        public void JoinGame(Guid playerId, Guid gameId)
        {
            if (_players.TryGetValue(playerId, out var player))
            {
                player.JoinGame(gameId);
            }
        }

        public void JoinLobby(Player player, LobbyManager2.Lobby2 lobby)
        {
            if (_players.TryGetValue(player.Id, out var playerImpl))
            {
                playerImpl.JoinLobby(lobby);
                lobby.Join(player);
            }
        }

        public void LeaveLobby(Player player)
        {
            if (_players.TryGetValue(player.Id, out var playerImpl))
            {
                playerImpl.Lobby.Leave(player);
                playerImpl.LeaveLobby();
            }
        }

        public (Result, Player) Get(string connectionId)
        {
            if (_connectionIdToPlayerId.TryGetValue(connectionId, out var playerId))
            {
                if (_players.TryGetValue(playerId, out var player))
                {
                    return (Result.Success, player);
                }
            }

            return (Result.NotFound, null);
        }

        public abstract class Player
        {
            public Player(string connectionId, string name)
            {
                Id = Guid.NewGuid();
                Lobby = null;
                GameId = Guid.Empty;
                ConnectionId = connectionId;
                Name = name;
            }

            public Guid Id { get; }

            public string ConnectionId { get; }

            public string Name { get; protected set; }

            public LobbyManager2.Lobby2 Lobby { get; protected set; }

            public Guid GameId { get; protected set; }
        }

        private class PlayerImpl : Player
        {
            public PlayerImpl(string connectionId, string name) : base(connectionId, name)
            {
            }

            public void UpdateName(string name)
            {
                Name = name;
            }

            public void JoinGame(Guid gameId)
            {
                GameId = gameId;
            }

            public void JoinLobby(LobbyManager2.Lobby2 lobby)
            {
                Lobby = lobby;
            }

            public void LeaveLobby()
            {
                Lobby = null;
            }
        }
    }
}