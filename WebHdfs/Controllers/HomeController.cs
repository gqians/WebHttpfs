using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebHdfs.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        public void poxy(string path,string op,string name)
        {
            hdfsProxy Geo = new hdfsProxy(path,op,name);
            HttpContextBase context = this.HttpContext;
            Geo.ProcessRequest1(context);
        }
    }
}