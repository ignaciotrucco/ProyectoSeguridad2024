using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]
// Una vez creado el primer usuario descomentar


public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }


    public async Task<IActionResult> Index()
    {
        await CrearRolesyPrimerUsuario();
        // Una vez creado el primer usuario comentar

        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        string nombreUsuario = "No se encontró el usuario";

        var tieneRolUsuario = await _context.UserRoles.FirstOrDefaultAsync(p => p.UserId == usuarioLogueadoID);
        if (tieneRolUsuario != null)
        {
            //BUSCAMOS EL NOMBRE DEL ROL
            var rolUsuario = await _context.Roles.FirstOrDefaultAsync(p => p.Id == tieneRolUsuario.RoleId);
            if (rolUsuario.Name == "EMPLEADO" || rolUsuario.Name == "ADMINISTRADOR")
            {
                var persona = await _context.Personas.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
                nombreUsuario = persona?.NombreCompleto ?? "Nombre no disponible";
            }
            else if (rolUsuario.Name == "CLIENTE")
            {
                var empresa = await _context.Empresas.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
                nombreUsuario = empresa?.RazonSocial ?? "Razon social no disponible";
            }
        }

        ViewBag.NombreTitulo = nombreUsuario;

        return View();
    }

    public async Task<JsonResult> CrearRolesyPrimerUsuario()
    {
        //CREAMOS ROL ADMINISTRADOR
        var crearRolAdmin = _context.Roles.Where(c => c.Name == "ADMINISTRADOR").SingleOrDefault();
        if (crearRolAdmin == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("ADMINISTRADOR"));
        }

        //CREAMOS ROL EMPLEADO
        var crearRolEmpl = _context.Roles.Where(c => c.Name == "EMPLEADO").SingleOrDefault();
        if (crearRolEmpl == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("EMPLEADO"));
        }

        //CREAMOS ROL CLIENTE
        var crearRolCli = _context.Roles.Where(c => c.Name == "CLIENTE").SingleOrDefault();
        if (crearRolCli == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("CLIENTE"));
        }

        //CREAMOS USUARIO PRINCIPAL (ADMIN)
        bool creado = false;

        var usuario = _context.Users.Where(u => u.Email == "adminsistema@gmail.com").SingleOrDefault();
        if (usuario == null)
        {
            var user = new IdentityUser { UserName = "adminsistema@gmail.com", Email = "adminsistema@gmail.com" };
            var result = await _userManager.CreateAsync(user, "ignacioyjose");

            await _userManager.AddToRoleAsync(user, "ADMINISTRADOR");
            creado = result.Succeeded;
        }

        //CODIGO PARA BUSCAR EL USUARIO EN CASO DE NECESITARLO
        var superusuario = _context.Users.Where(s => s.Email == "admin@sistema.com").SingleOrDefault();
        if (superusuario != null)
        {

            //var personaSuperusuario = _contexto.Personas.Where(r => r.UsuarioID == superusuario.Id).Count();

            var usuarioID = superusuario.Id;

        }

        return Json(creado);
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
}
