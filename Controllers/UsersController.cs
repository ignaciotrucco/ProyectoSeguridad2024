using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal2024.Models;

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
        ViewBag.RolID = new SelectList(roles.OrderBy(t => t.Name), "Name", "Name");

        return View();
    }

    public JsonResult ListadoUsuarios(string UsuarioID)
    {
        var listadoUsuarios = _context.Users.ToList();
        if (UsuarioID != null)
        {
            listadoUsuarios = _context.Users.Where(l => l.Id == UsuarioID).ToList();
        }
        
        List<VistaUsuarios> usuariosMostrar = new List<VistaUsuarios>();
        foreach (var usuario in listadoUsuarios)
        {
            var rolNombre = "";
            //POR CADA USUARIO VAMOS A BUSCAR SI TIENE ROL ASIGNADO
            var rolUsuario = _context.UserRoles.Where(l => l.UserId == usuario.Id).FirstOrDefault();
            if(rolUsuario != null){
                 rolNombre = _context.Roles.Where(l => l.Id == rolUsuario.RoleId).Select(r => r.Name).FirstOrDefault();
            }
            var usuarioMostrar = new VistaUsuarios
            {
                UsuarioID = usuario.Id,
                Email = usuario.Email,
                RolNombre = rolNombre,
            };
            usuariosMostrar.Add(usuarioMostrar);
        }

        return Json(usuariosMostrar);
    }

    public async Task<JsonResult> GuardarUsuario(string Username, string Email, string Password, string rol)
    {
        var user = new IdentityUser { UserName = Username, Email = Email};

        var result = await _userManager.CreateAsync(user, Password);

        //BUSCAR POR MEDIO DE CORREO ELECTRONICO ESE USUARIO CREADO PARA BUSCAR EL ID
        var usuario = _context.Users.Where(u => u.Email == Email).SingleOrDefault();

        await _userManager.AddToRoleAsync(usuario, rol);

        return Json(result.Succeeded);
    }

    public JsonResult EditarUsuario(int UsuarioID, string Email)
    {

        return Json(true);
    }

    public JsonResult EliminarUsuario(string UsuarioID)
    {

        var eliminarUsuario = _context.Users.Find(UsuarioID);
        _context.Remove(eliminarUsuario);
        _context.SaveChanges();

        return Json(eliminarUsuario);
    }

}