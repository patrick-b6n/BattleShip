using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class PlayerManager
    {
        private readonly ConcurrentDictionary<string, Player> _players;

        public PlayerManager()
        {
            _players = new ConcurrentDictionary<string, Player>();
        }

        public IEnumerable<Player> All => _players.Values;

        public Player Create(string id)
        {
            var player = new Player(id);
            _players.AddOrUpdate(player.Id, player, (k, p) => player);

            return player;
        }

        public Player Get(string id)
        {
            return _players.TryGetValue(id, out var player) ? player : null;
        }

        public void Remove(Player player)
        {
            if (player.Lobby != null)
            {
                throw new Exception("Player is still in lobby.");
            }

            _players.TryRemove(player.Id, out _);
        }

        public void Remove(string id)
        {
            _players.TryRemove(id, out _);
        }
    }
}
