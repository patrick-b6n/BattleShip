using System.Collections.Generic;
using System.Linq;
using BattleShip.Domain.Entity;

namespace BattleShip.Domain
{
    public class PlayerManager
    {
        private readonly List<Player> _players;

        public PlayerManager()
        {
            _players = new List<Player>();
        }

        public IReadOnlyList<Player> Players => _players;

        public Player Create(string connectionId, string name)
        {
            var player = new Player(connectionId, name);
            _players.Add(player);
            return player;
        }

        public (Result, Player) Get(string connectionId)
        {
            var player = _players.FirstOrDefault(p => p.ConnectionId == connectionId);

            if (player != null)
            {
                return (Result.Success, player);
            }
            else
            {
                return (Result.NotFound, null);
            }
        }
    }
}