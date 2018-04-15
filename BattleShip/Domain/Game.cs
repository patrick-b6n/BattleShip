using System;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class Game
    {
        public Game(string player1Id)
        {
            Id = Guid.NewGuid();
            JoinGame(player1Id);
        }

        public Guid Id { get; }

        public Player Player1 { get; set; }
        public Player Player2 { get; set; }
        public List<Player> Spectators { get; set; }

        public PlayerType JoinGame(string playerId)
        {
            var player = new Player(playerId);

            if (Player1 == null)
            {
                Player1 = player;
                return PlayerType.Player;
            }

            if (Player2 == null)
            {
                Player2 = player;
                return PlayerType.Player;
            }

            Spectators.Add(player);
            return PlayerType.Spectator;
        }
    }

    public enum PlayerType
    {
        Player,
        Spectator
    }
}