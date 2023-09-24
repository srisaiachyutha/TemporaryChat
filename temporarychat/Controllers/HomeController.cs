using temporarychat.Models;
using temporarychat.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace temporarychat.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(string roomName, string userName)//[FromBody] RoomRequest roomRequest)
        {
            //if (!ModelState.IsValid)
            //{
            //    string homeUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

            //    return Redirect(homeUrl);

            //}
            //return View("Error", ModelState.Values.SelectMany(v => v.Errors));

            string homeUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}/{roomName}?userName={userName}";

            return RedirectPermanent(homeUrl);
        }

        public IActionResult Room(string roomName, [FromQuery(Name = "userName")] string userName)
        {

            // validating the user name
            string homeUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (string.IsNullOrEmpty(userName))
                return Redirect(homeUrl);

            return View("Room", new RoomRequest { RoomName = roomName, UserName = userName });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}