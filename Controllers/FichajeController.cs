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
        string mensaje = "";

        // OBTENEMOS EL ID DEL USUARIO LOGUEADO
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        // BUSCAMOS LA PERSONA ASOCIADA A ESE USUARIO
        var persona = _context.Personas
            .Where(p => p.UsuarioID == usuarioLogueadoID).FirstOrDefault();

        if (persona == null)
        {
            mensaje = "No se encontró la persona asociada al usuario logueado.";
        }

        // BUSCAMOS LA ASIGNACION DE JORNADA PARA LA PERSONA
        var asignacionJornada = _context.AsignacionJornadas
            .Where(a => a.PersonaID == persona.PersonaID).FirstOrDefault();

        if (asignacionJornada == null)
        {
            mensaje = "No se encontró una jornada laboral asignada para el usuario logueado.";
        }

        // OBTENEMOS LA JORNADA LABORAL CORRESPONDIENTE A LA ASIGNACION
        var jornadaLaboral = _context.JornadaLaboral
            .Where(j => j.JornadaLaboralID == asignacionJornada.JornadaLaboralID).FirstOrDefault();

        if (jornadaLaboral == null)
        {
            mensaje = "No se encontró la jornada laboral asociada.";
        }

        // EXTRAEMOS SOLO LA PARTE DE HORA Y MINUTO
        var horaFichaje = DateTime.Now.TimeOfDay;
        var horaEntrada = jornadaLaboral.HorarioEntrada.TimeOfDay;
        var horaSalida = jornadaLaboral.HorarioSalida.TimeOfDay;

        bool esValido = false;

        // VALIDAMOS LA HORA DE FICHAJE
        if (Momento == Momento.Entrada)
        {
            esValido = horaFichaje >= horaEntrada;
        }
        else if (Momento == Momento.Salida)
        {
            esValido = horaFichaje <= horaSalida;
        }

        // CREAR EL TURNO LABORAL Y GUARDARLO INDEPENDIENTEMENTE DE SI ES VÁLIDO O NO
        var turnoLaboral = new TurnoLaboral
        {
            UsuarioID = usuarioLogueadoID,
            JornadaLaboralID = jornadaLaboral.JornadaLaboralID,
            FechaFichaje = DateTime.Now,
            Momento = Momento,
            Estado = esValido // Se guarda como true si está dentro del horario, false si no.
        };

        _context.Add(turnoLaboral);
        _context.SaveChanges();

        if (esValido)
        {
            mensaje = "Fichaje registrado correctamente.";
        }
        else
        {
            mensaje = "Fichaje fuera del horario permitido";
        }

        return Json(mensaje);
    }



    public JsonResult HistorialFichajes(int? PersonaID)
    {
        List<VistaTurno> VistaTurnoLaboral = new List<VistaTurno>();

        var listadoTurnos = _context.TurnoLaboral.ToList();
        var jornadaLaboral = _context.JornadaLaboral.ToList();
        var asignacionJornada = _context.AsignacionJornadas.ToList();
        var personas = _context.Personas.ToList();

        if (PersonaID != 0 && PersonaID != null)
        {
            //BUSCAR LA PERSONA CORRESPONDIENTE A LA PERSONAID PROPORCIONADA
            var personaFiltrada = personas.SingleOrDefault(p => p.PersonaID == PersonaID);

            if (personaFiltrada != null)
            {
                //FILTRADO POR PERSONAS
                listadoTurnos = listadoTurnos.Where(l => l.UsuarioID == personaFiltrada.UsuarioID).ToList();
            }
        }

        foreach (var listadoTurno in listadoTurnos)
        {

            var persona = personas.SingleOrDefault(p => p.UsuarioID == listadoTurno.UsuarioID);

            if (persona != null)
            {

                var personasMostrar = VistaTurnoLaboral.Where(p => p.UsuarioID == listadoTurno.UsuarioID).SingleOrDefault();

                var jornada = jornadaLaboral.Where(j => j.JornadaLaboralID == listadoTurno.JornadaLaboralID).SingleOrDefault();

                var asignacion = asignacionJornada.Where(a => a.PersonaID == persona.PersonaID).SingleOrDefault();

                if (personasMostrar == null)
                {
                    personasMostrar = new VistaTurno
                    {
                        UsuarioID = listadoTurno.UsuarioID,
                        PersonaID = persona.PersonaID,
                        NombreEmpleado = persona.NombreCompleto,
                        VistaTurnosLaborales = new List<VistaTurnosLaborales>()
                    };
                    VistaTurnoLaboral.Add(personasMostrar);
                }

                var mostrarTurnos = new VistaTurnosLaborales
                {
                    TurnoLaboralID = listadoTurno.TurnoLaboralID,
                    JornadaLaboralID = listadoTurno.JornadaLaboralID,
                    Jornada = jornada.InfoJornada,
                    FechaFichaje = listadoTurno.FechaFichaje,
                    FechaFichajeString = listadoTurno.FechaFichaje.ToString("dddd dd MMM yyyy - HH:mm"),
                    Momento = listadoTurno.Momento,
                    MomentoString = listadoTurno.Momento.ToString().ToUpper(),
                    Estado = listadoTurno.Estado
                };
                personasMostrar.VistaTurnosLaborales.Add(mostrarTurnos);
            }
        }

        return Json(VistaTurnoLaboral);
    }



    // var listadoFichajes = _context.TurnoLaboral
    //     .Join(_context.JornadaLaboral,
    //         turnos => turnos.JornadaLaboralID,
    //         jornada => jornada.JornadaLaboralID,
    //         (turnos, jornada) => new { turnos, jornada })
    //     .Join(_context.AsignacionJornadas,
    //         asignacionJornada => asignacionJornada.turnos.JornadaLaboralID,
    //         asignacion => asignacion.JornadaLaboralID, 
    //         (asignacionJornada, asignacion) => new { asignacionJornada.jornada, asignacionJornada.turnos, asignacion })
    //     .Join(_context.Personas,
    //         asignacionJornada => asignacionJornada.asignacion.PersonaID,
    //         persona => persona.PersonaID,
    //         (asignacionJornada, persona) => new { asignacionJornada, persona })
    //     .ToList();

    //     if (PersonaID != null && PersonaID != 0) {
    //         listadoFichajes = listadoFichajes.Where(l => l.persona.PersonaID == PersonaID).ToList();
    //     }


    //         var mostrarFichajes = listadoFichajes.Select(m => new VistaTurnosLaborales
    //         {
    //             TurnoLaboralID = m.asignacionJornada.turnos.TurnoLaboralID,
    //             UsuarioID = m.asignacionJornada.turnos.UsuarioID,
    //             NombreEmpleado = m.persona.NombreCompleto,
    //             JornadaLaboralID = m.asignacionJornada.turnos.JornadaLaboralID,
    //             Jornada = m.asignacionJornada.jornada.InfoJornada,
    //             FechaFichaje = m.asignacionJornada.turnos.FechaFichaje,
    //             FechaFichajeString = m.asignacionJornada.turnos.FechaFichaje.ToString("HH:mm"),
    //             Momento = m.asignacionJornada.turnos.Momento,
    //             MomentoString = m.asignacionJornada.turnos.Momento.ToString().ToUpper(),
    //             Latitud = m.asignacionJornada.turnos.Latitud,
    //             Longitud = m.asignacionJornada.turnos.Longitud,
    //             Estado = m.asignacionJornada.turnos.Estado
    //         }).ToList();
}

