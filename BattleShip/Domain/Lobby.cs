using System;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class Lobby
    {
        private readonly List<Player> _players;

        public Lobby(Guid id)
        {
            _players = new List<Player>();

            Id = id;
        }

        public Guid Id { get; }

        public void Join(Player player)
        {
            _players.Add(player);
            player.Joined(this);
        }

        public void Leave(Player player)
        {
            _players.Remove(player);
        }

        public IEnumerable<Player> List()
        {
            return _players;
        }

        public bool IsEmpty()
        {
            return _players.Count == 0;
        }
    }
}
