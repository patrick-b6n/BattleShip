using System;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class PlayerManager
    {
        private readonly Dictionary<string, Player> _players;

        public PlayerManager()
        {
            _players = new Dictionary<string, Player>();
        }

        public void Add(Player player)
        {
            _players.Add(player.Id, player);
        }

        public IEnumerable<Player> GetAll()
        {
            return _players.Values;
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

            _players.Remove(player.Id);
        }

        public void Remove(string id)
        {
            _players.Remove(id);
        }
    }
}
