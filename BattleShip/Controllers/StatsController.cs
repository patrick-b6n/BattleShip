using System.Linq;
using BattleShip.Domain;
using Microsoft.AspNetCore.Mvc;

namespace BattleShip.Controllers
{
    public class StatsController : Controller
    {
        private readonly GameManager _gameManager;
        private readonly PlayerManager _playerManager;
        private readonly LobbyManager _lobbyManager;

        public StatsController(GameManager gameManager,
                               PlayerManager playerManager,
                               LobbyManager lobbyManager)
        {
            _gameManager = gameManager;
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Json(new
            {
                Lobbies = _lobbyManager.All,
                Games = _gameManager.All,
                Players = _playerManager.All
            });
        }
    }
}