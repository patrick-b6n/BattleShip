using BattleShip.Domain;
using Microsoft.AspNetCore.Mvc;

namespace BattleShip.Controllers
{
    public class StatsController : Controller
    {
        private readonly LobbyManager _lobbyManager;
        private readonly PlayerManager _playerManager;

        public StatsController(PlayerManager playerManager,
                               LobbyManager lobbyManager)
        {
            _playerManager = playerManager;
            _lobbyManager = lobbyManager;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Json(new
            {
                Lobbies = _lobbyManager.Lobbies,
                Players = _playerManager.Players
            });
        }
    }
}