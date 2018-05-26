using System;
using System.Collections.Generic;

namespace BattleShip.Domain.Entity
{
    public class Lobby
    {
        private readonly List<Player> _players;

        internal Lobby()
        {
            Created = DateTime.UtcNow;
            Id = Guid.NewGuid();

            _players = new List<Player>();
        }

        public DateTime Created { get; }

        public Guid Id { get; }

        public IReadOnlyList<Player> Players => _players;

        internal void AddPlayer(Player player)
        {
            _players.Add(player);
        }

        internal void RemovePlayer(Player player)
        {
            _players.Remove(player);
        }
    }
}