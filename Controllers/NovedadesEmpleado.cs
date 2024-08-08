using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class NovedadesEmpleadoController : Controller
{
    private ApplicationDbContext _context;

    public NovedadesEmpleadoController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult NovedadesEmpleado()
    {
        return View();
    }
}