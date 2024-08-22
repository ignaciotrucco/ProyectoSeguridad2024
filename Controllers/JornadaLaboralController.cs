using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]
// Una vez creado el primer usuario descomentar


public class JornadaLaboralController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public JornadaLaboralController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }


    public IActionResult JornadaLaboral()
    {
        var empresa = _context.Empresas.ToList();
        empresa.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE LA EMPRESA . . ]" });
        ViewBag.EmpresaID = new SelectList(empresa.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

        return View();
    }
}
