using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class GameManager
    {
        private readonly ConcurrentDictionary<Guid, Game> _games;

        public GameManager()
        {
            _games = new ConcurrentDictionary<Guid, Game>();
        }

        public IEnumerable<Game> All => _games.Values;

        public Game NewGame(Player player1, Player player2)
        {
            var game = new Game(player1, player2);
            _games.AddOrUpdate(game.Id, game, (id, g) => game);

            return game;
        }

        public Game Get(Guid gameId)
        {
            return _games.TryGetValue(gameId, out var game) ? game : null;
        }
    }
}