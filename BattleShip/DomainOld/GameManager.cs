using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace BattleShip.DomainOld
{
    public class GameManager
    {
        private readonly ConcurrentDictionary<Guid, IEnumerable<Player>> _gameIdToPlayers;

        public GameManager()
        {
            _gameIdToPlayers = new ConcurrentDictionary<Guid, IEnumerable<Player>>();
        }

        public IReadOnlyDictionary<Guid, IEnumerable<Player>> All => _gameIdToPlayers;

        public IEnumerable<Player> Get(Guid gameId)
        {
            return _gameIdToPlayers.GetValueOrDefault(gameId, Enumerable.Empty<Player>());
        }

        public Guid NewGame(Player player1, Player player2)
        {
            var gameId = Guid.NewGuid();

            var players = new List<Player> { player1, player2 };
            _gameIdToPlayers.TryAdd(gameId, players);

            player1.JoinGame(gameId);
            player2.JoinGame(gameId);

            return gameId;
        }

        public IEnumerable<Player> RemoveGame(Guid gameId)
        {
            if (_gameIdToPlayers.TryRemove(gameId, out var players))
            {
                return players;
            }

            return Enumerable.Empty<Player>();
        }

        public Player GetOpponent(Player player)
        {
            if (_gameIdToPlayers.TryGetValue(player.GameId, out var players))
            {
                return players.FirstOrDefault(p => p != player);
            }

            return null;
        }
    }
}