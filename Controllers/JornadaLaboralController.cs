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

    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult JornadaLaboral()
    {
        var empresa = _context.Empresas.ToList();
        empresa.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE LA EMPRESA . . ]" });
        ViewBag.EmpresaID = new SelectList(empresa.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

        var personas = (from persona in _context.Personas
                        join user in _context.Users on persona.UsuarioID equals user.Id
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        where role.Name == "EMPLEADO"
                        select persona).ToList();
        personas.Add(new Persona { PersonaID = 0, NombreCompleto = "[SELECCIONE EL EMPLEADO . . ]" });
        ViewBag.PersonaID = new SelectList(personas.OrderBy(t => t.NombreCompleto), "PersonaID", "NombreCompleto");

        var jornada = _context.JornadaLaboral.ToList();
        jornada.Add(new JornadaLaboral { JornadaLaboralID = 0, Lugar = "[SELECCIONE LA JORNADA . . ]" });
        ViewBag.JornadaLaboralID = new SelectList(jornada.OrderBy(t => t.Lugar), "JornadaLaboralID", "InfoJornada");

        var empresaFiltrar = _context.Empresas.ToList();
        empresaFiltrar.Add(new Empresa { EmpresaID = 0, RazonSocial = "¡FILTRÁ POR CLIENTES!"});
        ViewBag.EmpresaFiltrar = new SelectList(empresaFiltrar.OrderBy(e => e.EmpresaID), "EmpresaID", "RazonSocial");

        var empleadoFiltrar = (from persona in _context.Personas
                        join user in _context.Users on persona.UsuarioID equals user.Id
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        where role.Name == "EMPLEADO"
                        select persona).ToList();
        empleadoFiltrar.Add(new Persona { PersonaID = 0, NombreCompleto = "¡FILTRÁ POR EMPLEADO!" });
        ViewBag.EmpleadoFiltrar = new SelectList(empleadoFiltrar.OrderBy(t => t.PersonaID), "PersonaID", "NombreCompleto");

        return View();
    }

    public JsonResult ListadoJornadas(int? JornadaLaboralID, int? EmpresaID)
    {
        var listadoJornadas = _context.JornadaLaboral
            .Join(_context.Empresas, // incluye la tabla Empresas
                jornada => jornada.EmpresaID, // llama EmpresaID en JornadaLaboral
                empresa => empresa.EmpresaID, // Llave primaria en Empresas
                (jornada, empresa) => new { jornada, empresa }) // Selecciona ambas tablas
            .ToList();

        if (JornadaLaboralID != null)
        {
            listadoJornadas = listadoJornadas.Where(l => l.jornada.JornadaLaboralID == JornadaLaboralID).ToList();
        }

        if (EmpresaID != null && EmpresaID != 0) {
            listadoJornadas = listadoJornadas.Where(l => l.empresa.EmpresaID == EmpresaID).ToList();
        }

        var mostrarJornadas = listadoJornadas.OrderBy(m => m.empresa.RazonSocial).Select(m => new VistaJornadaLaboral
        {
            // ASIGNAMOS EL ID DE LA JORNADA LABORAL DEL OBJETO JORNADA
            JornadaLaboralID = m.jornada.JornadaLaboralID,
            // ASIGNAMOS EL LUGAR DE LA JORNADA DEL OBJETO JORNADA
            Lugar = m.jornada.Lugar,
            // ASIGNAMOS EL VALOR DEL CAMPO DIA DEL OBJETO JORNADA
            Dia = m.jornada.Dia,
            // ASIGNAMOS LA FECHA ESPECIAL DEL OBJETO JORNADA
            DiaEspecial = m.jornada.DiaEspecial,
            // CONVERTIMOS DIAESPECIAL A CADENA DE TEXTO SOLO SI DIA ES FALSO
            DiaEspecialString = m.jornada.Dia ? null : m.jornada.DiaEspecial.ToString("ddd dd MMM yyyy"),
            // ASIGNAMOS EL VALOR DEL CAMPO LUNES DEL OBJETO JORNADA
            Lunes = m.jornada.Lunes,
            // ASIGNAMOS EL VALOR DEL CAMPO MARTES DEL OBJETO JORNADA
            Martes = m.jornada.Martes,
            // ASIGNAMOS EL VALOR DEL CAMPO MIERCOLES DEL OBJETO JORNADA
            Miercoles = m.jornada.Miercoles,
            // ASIGNAMOS EL VALOR DEL CAMPO JUEVES DEL OBJETO JORNADA
            Jueves = m.jornada.Jueves,
            // ASIGNAMOS EL VALOR DEL CAMPO VIERNES DEL OBJETO JORNADA
            Viernes = m.jornada.Viernes,
            // ASIGNAMOS EL VALOR DEL CAMPO SABADO DEL OBJETO JORNADA
            Sabado = m.jornada.Sabado,
            // ASIGNAMOS EL VALOR DEL CAMPO DOMINGO DEL OBJETO JORNADA
            Domingo = m.jornada.Domingo,
            // AGRUPAMOS LOS DÍAS DE LA SEMANA SI DIA ES VERDADERO, SINO ES NULO
            DiasSemana = m.jornada.Dia ? AgruparDias(new[]
            {
                m.jornada.Lunes ? "Lunes" : null,
                m.jornada.Martes ? "Martes" : null,
                m.jornada.Miercoles ? "Miércoles" : null,
                m.jornada.Jueves ? "Jueves" : null,
                m.jornada.Viernes ? "Viernes" : null,
                m.jornada.Sabado ? "Sábado" : null,
                m.jornada.Domingo ? "Domingo" : null
            }.Where(d => d != null).ToArray()) : null,
            // ASIGNAMOS EL ID DE LA EMPRESA DEL OBJETO JORNADA
            EmpresaID = m.jornada.EmpresaID,
            // ASIGNAMOS EL NOMBRE DE LA EMPRESA DEL OBJETO EMPRESA
            NombreEmpresa = m.empresa.RazonSocial,
            // ASIGNAMOS EL HORARIO DE ENTRADA DEL OBJETO JORNADA
            HorarioEntrada = m.jornada.HorarioEntrada,
            // CONVERTIMOS HORARIOENTRADA A CADENA DE TEXTO
            HorarioEntradaString = m.jornada.HorarioEntrada.ToString("HH:mm"),
            // ASIGNAMOS EL HORARIO DE SALIDA DEL OBJETO JORNADA
            HorarioSalida = m.jornada.HorarioSalida,
            // CONVERTIMOS HORARIOSALIDA A CADENA DE TEXTO
            HorarioSalidaString = m.jornada.HorarioSalida.ToString("HH:mm")
        }).ToList();


        return Json(mostrarJornadas);
    }


    private bool DiasConsecutivos(string diaActual, string siguienteDia)
    {
        // DEFINIMOS UN ARREGLO CON LOS DÍAS DE LA SEMANA
        var diasSemana = new[] { "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" };
        // OBTENEMOS EL ÍNDICE DEL DÍA ACTUAL EN EL ARREGLO
        int indiceActual = Array.IndexOf(diasSemana, diaActual);
        // OBTENEMOS EL ÍNDICE DEL SIGUIENTE DÍA EN EL ARREGLO
        int indiceSiguiente = Array.IndexOf(diasSemana, siguienteDia);
        // COMPROBAMOS SI EL ÍNDICE DEL SIGUIENTE DÍA ES EXACTAMENTE UNO MÁS QUE EL DEL DÍA ACTUAL
        return indiceSiguiente == indiceActual + 1;
    }


    private string AgruparDias(string[] dias)
    {
        // CREAMOS UNA LISTA PARA ALMACENAR LOS GRUPOS DE DÍAS
        var grupos = new List<string>();
        // RECORREMOS CADA DÍA EN EL ARREGLO
        for (int i = 0; i < dias.Length; i++)
        {
            // MARCAMOS EL INICIO DEL GRUPO ACTUAL
            int inicio = i;
            // MIENTRAS EL SIGUIENTE DÍA SEA CONSECUTIVO, CONTINUAR AVANZANDO
            while (i + 1 < dias.Length && DiasConsecutivos(dias[i], dias[i + 1]))
            {
                i++;
            }
            // SI SOLO HAY UN DÍA EN EL GRUPO, AÑADIRLO TAL CUAL
            if (inicio == i)
            {
                grupos.Add(dias[inicio]);
            }
            // SI HAY VÁRIOS DÍAS, FORMATEAR COMO "INICIO a FIN"
            else
            {
                grupos.Add($"{dias[inicio]} a {dias[i]}");
            }
        }
        // UNIR TODOS LOS GRUPOS CON COMAS Y ESPACIOS
        return string.Join(", ", grupos);
    }


    public JsonResult GuardarJornadaLaboral(int JornadaLaboralID, int EmpresaID, string Lugar, bool Dia, DateTime DiaEspecial, bool Lunes, bool Martes, bool Miercoles, bool Jueves, bool Viernes, bool Sabado, bool Domingo, DateTime HorarioEntrada, DateTime HorarioSalida)
    {
        string resultado = "";

        Lugar = Lugar.ToUpper();

        if (JornadaLaboralID == 0)
        {
            var nuevaJornada = new JornadaLaboral
            {
                EmpresaID = EmpresaID,
                Lugar = Lugar,
                Dia = Dia,
                DiaEspecial = DiaEspecial,
                Lunes = Lunes,
                Martes = Martes,
                Miercoles = Miercoles,
                Jueves = Jueves,
                Viernes = Viernes,
                Sabado = Sabado,
                Domingo = Domingo,
                HorarioEntrada = HorarioEntrada,
                HorarioSalida = HorarioSalida
            };
            _context.Add(nuevaJornada);
            _context.SaveChanges();
            resultado = "<i class='fas fa-check-circle'></i> ¡Jornada Laboral agregada correctamente!";
        }
        else
        {
            var editarJornada = _context.JornadaLaboral.Where(e => e.JornadaLaboralID == JornadaLaboralID).SingleOrDefault();
            if (editarJornada != null)
            {
                editarJornada.EmpresaID = EmpresaID;
                editarJornada.Lugar = Lugar;
                editarJornada.Dia = Dia;
                editarJornada.DiaEspecial = DiaEspecial;
                editarJornada.Lunes = Lunes;
                editarJornada.Martes = Martes;
                editarJornada.Miercoles = Miercoles;
                editarJornada.Jueves = Jueves;
                editarJornada.Viernes = Viernes;
                editarJornada.Sabado = Sabado;
                editarJornada.Domingo = Domingo;
                editarJornada.HorarioEntrada = HorarioEntrada;
                editarJornada.HorarioSalida = HorarioSalida;
                _context.SaveChanges();
                resultado = "<i class='fas fa-check-circle'></i> ¡Jornada Laboral editada correctamente!";
            }
        }

        return Json(resultado);
    }

    public JsonResult EliminarJornadaLaboral(int JornadaLaboralID)
    {
        bool eliminado = false;

        var existeAsignacion = _context.AsignacionJornadas.Where(e => e.JornadaLaboralID == JornadaLaboralID).Count();
        var existeFichaje = _context.TurnoLaboral.Where(e => e.JornadaLaboralID == JornadaLaboralID).Count();

        if (existeAsignacion == 0 && existeFichaje == 0)
        {
            var eliminarJornada = _context.JornadaLaboral.Find(JornadaLaboralID);
            _context.Remove(eliminarJornada);
            _context.SaveChanges();
            eliminado = true;
        }


        return Json(eliminado);
    }

    public JsonResult MostrarAsignacion(int? AsignacionJornadaID, int? Empleado)
    {
        var mostrarAsignacion = _context.AsignacionJornadas
    .Join(_context.JornadaLaboral,
        asignacion => asignacion.JornadaLaboralID,
        jornada => jornada.JornadaLaboralID,
        (asignacion, jornada) => new { asignacion, jornada })
    .Join(_context.Personas,
        asignacionJornada => asignacionJornada.asignacion.PersonaID,
        persona => persona.PersonaID,
        (asignacionJornada, persona) => new { asignacionJornada.asignacion, asignacionJornada.jornada, persona })
    .ToList();


        if (AsignacionJornadaID != null)
        {
            mostrarAsignacion = mostrarAsignacion.Where(m => m.asignacion.AsignacionJornadaID == AsignacionJornadaID).ToList();
        }

        if (Empleado != null && Empleado != 0) {
            mostrarAsignacion = mostrarAsignacion.Where(m => m.persona.PersonaID == Empleado).ToList();
        }

        var vistaAsignacion = mostrarAsignacion.OrderBy(v => v.persona.NombreCompleto).Select(v => new VistaAsignacion
        {
            AsignacionJornadaID = v.asignacion.AsignacionJornadaID,
            PersonaID = v.persona.PersonaID,
            PersonaNombre = v.persona.NombreCompleto,
            JornadaLaboralID = v.jornada.JornadaLaboralID,
            InfoJornada = v.jornada.InfoJornada,
            Dia = v.jornada.Dia,
            DiasSemana = v.jornada.Dia ? AgruparDias(new[]
            {
                v.jornada.Lunes ? "Lunes" : null,
                v.jornada.Martes ? "Martes" : null,
                v.jornada.Miercoles ? "Miércoles" : null,
                v.jornada.Jueves ? "Jueves" : null,
                v.jornada.Viernes ? "Viernes" : null,
                v.jornada.Sabado ? "Sábado" : null,
                v.jornada.Domingo ? "Domingo" : null
            }.Where(d => d != null).ToArray()) : null,
            DiaEspecial = v.jornada.DiaEspecial,
            // CONVERTIMOS DIAESPECIAL A CADENA DE TEXTO SOLO SI DIA ES FALSO
            DiaEspecialString = v.jornada.Dia ? null : v.jornada.DiaEspecial.ToString("ddd dd MMM yyyy"),
        }).ToList();


        return Json(vistaAsignacion);
    }

    public JsonResult GuardarAsignacion(int AsignacionJornadaID, int PersonaID, int JornadaLaboralID)
    {
        string resultado = "";

        if (AsignacionJornadaID == 0)
        {
            var nuevaAsignacion = new AsignacionJornada
            {
                PersonaID = PersonaID,
                JornadaLaboralID = JornadaLaboralID,
            };
            _context.Add(nuevaAsignacion);
            _context.SaveChanges();
            resultado = "<i class='fas fa-check-circle'></i> ¡Jornada Asignada agregada correctamente!";
        }
        else
        {
            var editarAsignacion = _context.AsignacionJornadas.Where(e => e.AsignacionJornadaID == AsignacionJornadaID).SingleOrDefault();
            if (editarAsignacion != null)
            {
                editarAsignacion.PersonaID = PersonaID;
                editarAsignacion.JornadaLaboralID = JornadaLaboralID;
                _context.SaveChanges();
                resultado = "<i class='fas fa-check-circle'></i> ¡Jornada Asignada editada correctamente!";
            }
        }


        return Json(resultado);
    }

    public JsonResult EliminarAsignacion(int AsignacionJornadaID)
    {
        var eliminarAsignacion = _context.AsignacionJornadas.Find(AsignacionJornadaID);
        _context.Remove(eliminarAsignacion);
        _context.SaveChanges();

        return Json(eliminarAsignacion);
    }

}
