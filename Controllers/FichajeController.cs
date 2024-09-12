using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ProyectoSeguridad2024.Controllers
{
    [Authorize]
    public class FichajeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _rolManager;

        public FichajeController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
        {
            _context = context;
            _userManager = userManager;
            _rolManager = rolManager;
        }

        public async Task<IActionResult> Fichaje() // Cambiado a async
        {
            var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);
            string nombreUsuario = "No se encontró el usuario";

            var tieneRolUsuario = await _context.UserRoles.FirstOrDefaultAsync(p => p.UserId == usuarioLogueadoID);
            if (tieneRolUsuario != null)
            {
                var rolUsuario = await _context.Roles.FirstOrDefaultAsync(p => p.Id == tieneRolUsuario.RoleId);
                if (rolUsuario.Name == "EMPLEADO" || rolUsuario.Name == "ADMINISTRADOR")
                {
                    var persona = await _context.Personas.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
                    nombreUsuario = persona?.NombreCompleto ?? "Nombre no encontrado";
                }
                else if (rolUsuario.Name == "CLIENTE")
                {
                    var empresa = await _context.Empresas.FirstOrDefaultAsync(p => p.UsuarioID == usuarioLogueadoID);
                    nombreUsuario = empresa?.RazonSocial ?? "Razon social no encontrada";
                }
            }

            ViewBag.NombreTitulo = nombreUsuario;

            return View(); // Asegúrate de que el View() esté bien definido
        }
    }
}