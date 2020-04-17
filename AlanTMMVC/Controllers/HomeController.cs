using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AlanTMMVC.Models;

namespace AlanTMMVC.Controllers
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

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public int Add(int number1, int number2)
        {
            return number1 + number2;
        }

        public ActionResult Bio()
        {
            return PartialView("Bio");
        }

        public ActionResult Projects()
        {
            return PartialView("Projects");
        }

        public ActionResult ProjectCard(string cardName)
        {

            return PartialView("Project-Card-" + cardName);
        }

        public ActionResult ProjectCards(string cardName)
        {
            
            return PartialView("Project-Card-" + cardName);
        }
    }
}
