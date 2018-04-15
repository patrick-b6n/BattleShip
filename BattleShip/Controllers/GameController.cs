using Microsoft.AspNetCore.Mvc;

namespace BattleShip.Controllers
{
    public class GameController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}