using System;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    // TODO REMOVE GAMES
    public class GameManager
    {
        private readonly Dictionary<Guid, Game> _games;

        public GameManager()
        {
            _games = new Dictionary<Guid, Game>();
        }

        public IEnumerable<Game> All => _games.Values;

        public void Add(Game game)
        {
            _games.Add(game.Id, game);
        }

        public Game Get(Guid gameId)
        {
            if (_games.TryGetValue(gameId, out var game))
            {
                return game;
            }

            return null;
        }
    }
}
