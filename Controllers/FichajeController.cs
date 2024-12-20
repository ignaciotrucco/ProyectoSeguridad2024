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

    [Authorize(Roles = "EMPLEADO")]
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

    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult FichajeHistorial()
    {
        var personas = (from persona in _context.Personas
                        join user in _context.Users on persona.UsuarioID equals user.Id
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        where role.Name == "EMPLEADO"
                        select persona).ToList();

        personas.Add(new Persona { PersonaID = 0, NombreCompleto = "[TODOS]" });
        ViewBag.PersonaID = new SelectList(personas.OrderBy(t => t.NombreCompleto), "PersonaID", "NombreCompleto");

        var selectListItmes = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE...]"}
        };

        var enumValues = Enum.GetValues(typeof(Momento)).Cast<Momento>();

        selectListItmes.AddRange(enumValues.Select(e => new SelectListItem
        {
            Value = e.GetHashCode().ToString(),
            Text = e.ToString().ToUpper()
        }));

        ViewBag.Momento = selectListItmes.OrderBy(s => s.Text).ToList();

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
            return Json(mensaje);
        }

        // BUSCAMOS LA ASIGNACION DE JORNADA PARA LA PERSONA
        var asignacionJornada = _context.AsignacionJornadas
            .Where(a => a.PersonaID == persona.PersonaID).FirstOrDefault();

        if (asignacionJornada == null)
        {
            mensaje = "No se encontró una jornada laboral asignada para el usuario logueado.";
            return Json(mensaje);
        }

        // OBTENEMOS LA JORNADA LABORAL CORRESPONDIENTE A LA ASIGNACION
        var jornadaLaboral = _context.JornadaLaboral
            .Where(j => j.JornadaLaboralID == asignacionJornada.JornadaLaboralID).FirstOrDefault();

        if (jornadaLaboral == null)
        {
            mensaje = "No se encontró la jornada laboral asociada.";
            return Json(mensaje);
        }

        // VALIDACIÓN DEL DÍA
        var diaActual = DateTime.Now.DayOfWeek; //DIA ACTUAL
        bool diaValido = false;

        // SI DIA ES VERDADERO VALIDAMOS LOS DIAS DE LA SEMANA
        if (jornadaLaboral.Dia)
        {
            switch (diaActual)
            {
                case DayOfWeek.Monday:
                    diaValido = jornadaLaboral.Lunes;
                    break;
                case DayOfWeek.Tuesday:
                    diaValido = jornadaLaboral.Martes;
                    break;
                case DayOfWeek.Wednesday:
                    diaValido = jornadaLaboral.Miercoles;
                    break;
                case DayOfWeek.Thursday:
                    diaValido = jornadaLaboral.Jueves;
                    break;
                case DayOfWeek.Friday:
                    diaValido = jornadaLaboral.Viernes;
                    break;
                case DayOfWeek.Saturday:
                    diaValido = jornadaLaboral.Sabado;
                    break;
                case DayOfWeek.Sunday:
                    diaValido = jornadaLaboral.Domingo;
                    break;
            }
        }
        else
        {
            //SI DIA ES FALSO VALIDA EL DIA ESPECIAL
            diaValido = DateTime.Now.Date == jornadaLaboral.DiaEspecial.Date;
        }

        //SI EL DIA NO ES VALIDO ENVIAMOS MENSAJE DE ERROR ANTES DE GUARDAR EL FICHAJE
        if (!diaValido)
        {
            mensaje = "El fichaje no está permitido en este día.";
            return Json(mensaje);
        }

        // EXTRAEMOS SOLO LA PARTE DE HORA Y MINUTO
        var horaFichaje = DateTime.Now.TimeOfDay;
        var horaEntrada = jornadaLaboral.HorarioEntrada.TimeOfDay;
        var horaSalida = jornadaLaboral.HorarioSalida.TimeOfDay;

        // DEFINIMOS EL MARGEN DE 10 MINUTOS
        TimeSpan margen = TimeSpan.FromMinutes(10);

        bool esValido = false;

        // VALIDAMOS LA HORA DE FICHAJE
        if (Momento == Momento.Entrada)
        {
            //PERMITE FICHAR SOLO ENTRE LA HORA DE ENTRADA Y 10 MINUTOS DESPUES
            esValido = horaFichaje > horaEntrada && horaFichaje <= horaEntrada.Add(margen);
        }
        else if (Momento == Momento.Salida)
        {
            //PERMITE FICHAR SOLO EXACTAMENTE A LA HORA DE SALIDA O 10 MINUTOS DESPUES
            esValido = horaFichaje >= horaSalida && horaFichaje <= horaSalida.Add(margen);
        }

        // VALIDAR SI YA HAY UN FICHAJE PARA HOY DEL MISMO TIPO
        var fechaFichaje = DateTime.Today;
        var fichajeExistente = _context.TurnoLaboral
            .Where(t => t.UsuarioID == usuarioLogueadoID
                        && t.JornadaLaboralID == jornadaLaboral.JornadaLaboralID
                        && t.FechaFichaje.Date == fechaFichaje.Date
                        && t.Momento == Momento) // Validar el momento
            .SingleOrDefault();

        if (fichajeExistente != null)
        {
            mensaje = $"Ya se ha registrado un fichaje de tipo '{Momento}' para hoy.";
            return Json(mensaje);
        }


        // CREA EL TURNO LABORAL Y LO GUARDA INDEPENDIENTEMENTE DE SI ES VÁLIDO O NO
        var turnoLaboral = new TurnoLaboral
        {
            UsuarioID = usuarioLogueadoID,
            JornadaLaboralID = jornadaLaboral.JornadaLaboralID,
            FechaFichaje = DateTime.Now,
            Momento = Momento,
            Estado = esValido //SE GUARDA COMO TRUE SI FUE A HORARIO, SINO ES FALSE 
        };

        _context.Add(turnoLaboral);
        _context.SaveChanges();

        if (esValido)
        {
            mensaje = "<i class='fas fa-check-circle'></i> ¡Fichaje registrado correctamente!";
        }
        else
        {
            mensaje = "Fichaje fuera del horario permitido";
        }

        return Json(mensaje);
    }



    public JsonResult HistorialFichajes(int? PersonaID, DateTime? FechaDesde, DateTime? FechaHasta, Momento? Momento, bool Horario)
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

        if (FechaDesde != null && FechaHasta != null)
        {
            listadoTurnos = listadoTurnos.Where(l => l.FechaFichaje >= FechaDesde && l.FechaFichaje <= FechaHasta).ToList();
        }

        if (Momento != 0 && Momento != null)
        {
            listadoTurnos = listadoTurnos.Where(l => l.Momento == Momento).ToList();
        }

        if (Horario == true)
        {
            listadoTurnos = listadoTurnos.Where(l => l.Estado == false).ToList();
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
                        JornadaLaboralID = listadoTurno.JornadaLaboralID,
                        Jornada = jornada?.InfoJornada,
                        VistaTurnosLaborales = new List<VistaTurnosLaborales>()
                    };
                    VistaTurnoLaboral.Add(personasMostrar);
                }

                var mostrarTurnos = new VistaTurnosLaborales
                {
                    TurnoLaboralID = listadoTurno.TurnoLaboralID,
                    // JornadaLaboralID = listadoTurno.JornadaLaboralID,
                    // Jornada = jornada.InfoJornada,
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

    public JsonResult ObtenerImagenPersona()
    {
        var usuarioLogueado = _userManager.GetUserId(HttpContext.User);

        var persona = _context.Personas
            .Where(m => m.UsuarioID == usuarioLogueado)
            .SingleOrDefault();

        if (persona != null && persona.ArchivoID != null)
        {
            var imagen = _context.Archivos
                .Where(a => a.ArchivoID == persona.ArchivoID)
                .SingleOrDefault();

            if (imagen != null && imagen.ArchivoBinario != null)
            {
                string base64 = Convert.ToBase64String(imagen.ArchivoBinario);
                string contentType = imagen.ContentType;

                // Enviar la imagen en formato base64
                return Json(new
                {
                    ImagenBase64 = $"data:{contentType};base64,{base64}",
                    ImagenEncontrada = true
                });
            }
        }

        // Si no se encuentra imagen, indicar que no se encontró
        return Json(new
        {
            ImagenEncontrada = false
        });
    }



}

