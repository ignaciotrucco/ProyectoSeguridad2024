using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal2024.Models;

namespace ProyectoSeguridad2024.Controllers;

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

    public async Task<IActionResult> Fichaje()
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

        return View();
    }

    public IActionResult FichajeHistorial()
    {
        return View();
    }

    public JsonResult RegistrarMomento(Momento Momento)
    {
        // OBTENEMOS EL ID DEL USUARIO LOGUEADO
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        // OBTENEMOS LA FECHA Y HORA ACTUAL
        var fechaFichaje = DateTime.Now;

        // BUSCAMOS LA PERSONA ASOCIADA A ESE USUARIO
        var persona = _context.Personas
            .Where(p => p.UsuarioID == usuarioLogueadoID).FirstOrDefault();

        if (persona == null)
        {
            return Json(new { mensaje = "No se encontró la persona asociada al usuario logueado." });
        }

        // BUSCAMOS LA ASIGNACION DE JORNADA PARA LA PERSONA
        var asignacionJornada = _context.AsignacionJornadas
            .Where(a => a.PersonaID == persona.PersonaID).FirstOrDefault();

        if (asignacionJornada == null)
        {
            return Json(new { mensaje = "No se encontró una jornada laboral asignada para el usuario logueado." });
        }

        // OBTENEMOS LA JORNADA LABORAL CORRESPONDIENTE A LA ASIGNACION
        var jornadaLaboral = _context.JornadaLaboral
            .Where(j => j.JornadaLaboralID == asignacionJornada.JornadaLaboralID).FirstOrDefault();

        if (jornadaLaboral == null)
        {
            return Json(new { mensaje = "No se encontró la jornada laboral asociada." });
        }

        //EXTRAEMOS SOLO LA PARTE DE HORA Y MINUTO
        var horaFichaje = fechaFichaje.TimeOfDay;
        var horaEntrada = jornadaLaboral.HorarioEntrada.TimeOfDay;
        var horaSalida = jornadaLaboral.HorarioSalida.TimeOfDay;

        bool esEntrada = Momento == Momento.Entrada;
        bool esValido = false;

        if (esEntrada)
        {
            esValido = horaFichaje >= horaEntrada;
        }
        else
        {
            esValido = horaFichaje <= horaSalida;
        }

        if (!esValido)
        {
            return Json(new { mensaje = "La hora de fichaje está fuera del rango permitido." });
        }

        // DESPUES DE LAS VALIDACIONES CREAMOS EL TURNO LABORAL
        var turnoLaboral = new TurnoLaboral
        {
            UsuarioID = usuarioLogueadoID,
            JornadaLaboralID = jornadaLaboral.JornadaLaboralID,
            FechaFichaje = fechaFichaje,
            Momento = Momento,
            Estado = esValido
        };

        _context.Add(turnoLaboral);
        _context.SaveChanges();

        return Json(new { mensaje = "Fichaje registrado correctamente." });
    }


    public JsonResult HistorialFichajes()
    {
        var listadoFichajes = _context.TurnoLaboral.ToList();


        return Json(listadoFichajes);
    }

}

