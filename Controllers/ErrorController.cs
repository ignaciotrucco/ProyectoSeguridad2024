using Microsoft.AspNetCore.Mvc;

public class ErrorController : Controller
{
    [Route("Error/AccessDeniedView")]
    public IActionResult AccessDeniedView()
    {
        return View();
    }

    [Route("Error/NotFoundView")]
    public IActionResult NotFoundView()
    {
        return View();
    }
}
