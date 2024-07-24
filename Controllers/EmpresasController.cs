using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class EmpresasController : Controller
{
    private ApplicationDbContext _context;

    public EmpresasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Empresas()
    {

        return View();
    }
}