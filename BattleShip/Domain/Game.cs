using System;
using Newtonsoft.Json;

namespace BattleShip.Domain
{
    public class Game
    {
        public Game(Player player1, Player player2)
        {
            Id = Guid.NewGuid();
            Player1 = player1;
            Player2 = player2;

            Phase = GamePhase.Placing;

            Player1Board = new BoardField[10, 10];
            Player2Board = new BoardField[10, 10];

            for (var i = 0; i < 10; i++)
            {
                for (var j = 0; j < 10; j++)
                {
                    Player1Board[i,j] = BoardField.Free;
                    Player2Board[i,j] = BoardField.Free;
                }
            }
        }

        public Guid Id { get; }

        public Player Player1 { get; }

        public Player Player2 { get; }

        public GamePhase Phase { get; }

        [JsonIgnore]
        public BoardField[,] Player1Board { get; }

        [JsonIgnore]
        public BoardField[,] Player2Board { get; }
    }

    public enum BoardField
    {
        Free,
        Miss,
        Ship,
        ShipHit
    }

    public enum GamePhase
    {
        Placing,
        Bombing
    }
}