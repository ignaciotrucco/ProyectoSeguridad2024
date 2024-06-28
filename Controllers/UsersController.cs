using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class UsersController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public UsersController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }


    public IActionResult Users()
    {
        var roles = _context.Roles.ToList();
        ViewBag.RolID = new SelectList(roles.OrderBy(t => t.Name), "Id", "Name");

        return View();
    }

    public JsonResult ListadoUsuarios(string Email)
    {
        var listadoUsuarios = _context.Users.ToList();
        if (Email != null)
        {
            listadoUsuarios = _context.Users.Where(l => l.Email == Email).ToList();
        }

        return Json(listadoUsuarios);
    }

    // public async Task<JsonResult> GuardarUsuario(string Username, string Email, string Password, string rol)
    // {
    //     var user = new IdentityUser { UserName = Username, Email = Email};

    //     var result = await _userManager.CreateAsync(user, Password);

    //     //BUSCAR POR MEDIO DE CORREO ELECTRONICO ESE USUARIO CREADO PARA BUSCAR EL ID
    //     var usuario = _context.Users.Where(u => u.Email == Email).SingleOrDefault();

    //     await _userManager.AddToRoleAsync(usuario, rol);

    //     return Json(result.Succeeded);
    // }

}