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
        ViewBag.RolIDBuscar = new SelectList(roles.OrderBy(t => t.Name), "Name", "Name");

        return View();
    }

    private string GenerarContraseñaAleatoria(int longitud = 8)
    {
        string caracteresPermitidos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        Random random = new Random();
        return new string(Enumerable.Repeat(caracteresPermitidos, longitud).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public async Task<IActionResult> RestablecerContrasenia(string UsuarioID)
    {
        var usuario = await _userManager.FindByIdAsync(UsuarioID);
        if (usuario == null)
        {
            return NotFound("Usuario no encontrado");
        }

        string nuevaContrasenia = GenerarContraseñaAleatoria();

        //REESTABLECEMOS CONTRASEÑA
        var token = await _userManager.GeneratePasswordResetTokenAsync(usuario);
        var resultado = await _userManager.ResetPasswordAsync(usuario, token, nuevaContrasenia);

        if (resultado.Succeeded)
        {
            //RETORNAMOS LA NUEVA CONTRASEÑA AL USUARIO PARA MOSTRARLA EN EL MODAL
            return Json(new { success = true, nuevaContrasenia });
        }


        return Json(new { success = false, errores = "No se pudo reestablecer la contraseña" });
    }

    public JsonResult ListadoUsuarios(string UsuarioID, string rolIDbuscar)
    {
        var listadoUsuarios = _context.Users.ToList();

        if (!string.IsNullOrEmpty(UsuarioID))
        {
            listadoUsuarios = listadoUsuarios.Where(l => l.Id == UsuarioID).ToList();
        }

        if (!string.IsNullOrEmpty(rolIDbuscar))
        {
            // Filtrar usuarios que tienen el rol con el nombre especificado
            var roleId = _context.Roles.Where(r => r.Name == rolIDbuscar).Select(r => r.Id).FirstOrDefault();

            if (!string.IsNullOrEmpty(roleId))
            {
                listadoUsuarios = listadoUsuarios.Where(u =>
                    _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == roleId)
                ).ToList();
            }
        }

        List<VistaUsuarios> usuariosMostrar = new List<VistaUsuarios>();

        foreach (var usuario in listadoUsuarios)
        {
            var rolNombre = "";

            // Buscar el rol asignado al usuario
            var rolUsuario = _context.UserRoles.FirstOrDefault(l => l.UserId == usuario.Id);
            if (rolUsuario != null)
            {
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
        string mensaje = "";

        var user = new IdentityUser { UserName = Username, Email = Email };

        // Crear el usuario
        var result = await _userManager.CreateAsync(user, Password);

        if (result.Succeeded)
        {
            // Buscar el usuario por su Email
            var usuario = _context.Users.Where(u => u.Email == Email).SingleOrDefault();

            // Asignar el rol al usuario
            await _userManager.AddToRoleAsync(usuario, rol);

            // Mensaje de éxito
            mensaje = "<i class='fas fa-check-circle'></i> ¡Usuario guardado exitosamente!";
        }
        else
        {
            // Mensaje de error
            mensaje = "<i class='fas fa-exclamation-triangle'></i> ¡Error al guardar el usuario!";
        }

        // Devolver un JSON con el estado y el mensaje
        return Json(mensaje);
    }

    public JsonResult EliminarUsuario(string UsuarioID)
    {

        bool eliminado = false;

        var existePersona = _context.Personas.Where(e => e.UsuarioID == UsuarioID).Count();
        var existeEmpresa = _context.Empresas.Where(e => e.UsuarioID == UsuarioID).Count();

        if (existePersona == 0 && existeEmpresa == 0)
        {
            var eliminarUsuario = _context.Users.Find(UsuarioID);
            _context.Remove(eliminarUsuario);
            _context.SaveChanges();
            eliminado = true;
        }

        return Json(eliminado);
    }

}