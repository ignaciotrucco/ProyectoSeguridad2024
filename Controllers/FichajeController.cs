using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        var personas = _context.Personas.ToList();
        personas.Add(new Persona { PersonaID = 0, NombreCompleto = "[FILTRA POR PERSONAS]" });
        ViewBag.PersonaID = new SelectList(personas.OrderBy(t => t.NombreCompleto), "PersonaID", "NombreCompleto");

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

        // EXTRAEMOS SOLO LA PARTE DE HORA Y MINUTO
        var horaFichaje = fechaFichaje.TimeOfDay;
        var horaEntrada = jornadaLaboral.HorarioEntrada.TimeOfDay;
        var horaSalida = jornadaLaboral.HorarioSalida.TimeOfDay;

        bool esEntrada = Momento == Momento.Entrada;
        bool esValido = false;

        // VALIDAMOS LA HORA DE FICHAJE
        if (esEntrada)
        {
            esValido = horaFichaje >= horaEntrada;
        }
        else
        {
            esValido = horaFichaje <= horaSalida;
        }

        // CREAR EL TURNO LABORAL Y GUARDARLO INDEPENDIENTEMENTE DE SI ES VÁLIDO O NO
        var turnoLaboral = new TurnoLaboral
        {
            UsuarioID = usuarioLogueadoID,
            JornadaLaboralID = jornadaLaboral.JornadaLaboralID,
            FechaFichaje = fechaFichaje,
            Momento = Momento,
            Estado = esValido // Se guarda como true si está dentro del horario, false si no.
        };

        _context.Add(turnoLaboral);
        _context.SaveChanges();

        string mensaje = "";
        if (esValido)
        {
            mensaje = "Fichaje registrado correctamente.";
        }
        else
        {
            mensaje = "Fichaje fuera del horario permitido, se registró como no válido.";
        }

        return Json(new { mensaje });
    }



    public JsonResult HistorialFichajes(int? PersonaID)
    {
        var listadoFichajes = _context.TurnoLaboral
    .Join(_context.JornadaLaboral,
        turnos => turnos.JornadaLaboralID,
        jornada => jornada.JornadaLaboralID,
        (turnos, jornada) => new { turnos, jornada })
    .Join(_context.AsignacionJornadas,
        asignacionJornada => asignacionJornada.turnos.JornadaLaboralID,
        asignacion => asignacion.JornadaLaboralID, 
        (asignacionJornada, asignacion) => new { asignacionJornada.jornada, asignacionJornada.turnos, asignacion })
    .Join(_context.Personas,
        asignacionJornada => asignacionJornada.asignacion.PersonaID,
        persona => persona.PersonaID,
        (asignacionJornada, persona) => new { asignacionJornada, persona })
    .ToList();

    if (PersonaID != null && PersonaID != 0) {
        listadoFichajes = listadoFichajes.Where(l => l.persona.PersonaID == PersonaID).ToList();
    }


        var mostrarFichajes = listadoFichajes.Select(m => new VistaTurnosLaborales
        {
            TurnoLaboralID = m.asignacionJornada.turnos.TurnoLaboralID,
            UsuarioID = m.asignacionJornada.turnos.UsuarioID,
            NombreEmpleado = m.persona.NombreCompleto,
            JornadaLaboralID = m.asignacionJornada.turnos.JornadaLaboralID,
            Jornada = m.asignacionJornada.jornada.InfoJornada,
            FechaFichaje = m.asignacionJornada.turnos.FechaFichaje,
            FechaFichajeString = m.asignacionJornada.turnos.FechaFichaje.ToString("HH:mm"),
            Momento = m.asignacionJornada.turnos.Momento,
            MomentoString = m.asignacionJornada.turnos.Momento.ToString().ToUpper(),
            Latitud = m.asignacionJornada.turnos.Latitud,
            Longitud = m.asignacionJornada.turnos.Longitud,
            Estado = m.asignacionJornada.turnos.Estado
        }).ToList();


        return Json(mostrarFichajes);
    }

}

