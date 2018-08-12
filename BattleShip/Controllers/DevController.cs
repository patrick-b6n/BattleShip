using Microsoft.AspNetCore.Mvc;

namespace BattleShip.Controllers
{
    public class DevController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}