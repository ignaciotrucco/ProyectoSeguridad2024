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


    public IActionResult JornadaLaboral()
    {
        var empresa = _context.Empresas.ToList();
        empresa.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE LA EMPRESA . . ]" });
        ViewBag.EmpresaID = new SelectList(empresa.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

        var persona = _context.Personas.ToList();
        persona.Add(new Persona { PersonaID = 0, NombreCompleto = "[SELECCIONE EL EMPLEADO . . ]" });
        ViewBag.PersonaID = new SelectList(persona.OrderBy(t => t.NombreCompleto), "PersonaID", "NombreCompleto");

        var jornada = _context.JornadaLaboral.ToList();
        jornada.Add(new JornadaLaboral { JornadaLaboralID = 0, Lugar = "[SELECCIONE LA JORNADA . . ]" });
        ViewBag.JornadaLaboralID = new SelectList(jornada.OrderBy(t => t.Lugar), "JornadaLaboralID", "InfoJornada");

        return View();
    }

    public JsonResult ListadoJornadas(int? JornadaLaboralID, string busqueda)
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

        // FILTRAR POR CUALQUIER CAMPO SI SE PROPORCIONA UN TERMMINO DE BUSQUEDA
        if (!string.IsNullOrEmpty(busqueda))
        {
            listadoJornadas = listadoJornadas.Where(p =>
            p.jornada.Lugar.Contains(busqueda) ||
            p.jornada.Dia.ToString().Contains(busqueda) || 
            (p.jornada.Dia ? null : p.jornada.DiaEspecial.ToString("dd/MM/yyyy")).Contains(busqueda) || 
            p.empresa.RazonSocial.Contains(busqueda) ||
            p.jornada.HorarioEntrada.ToString("HH:mm").Contains(busqueda) || 
            p.jornada.HorarioSalida.ToString("HH:mm").Contains(busqueda) 
        ).ToList();
        }

        var mostrarJornadas = listadoJornadas.Select(m => new VistaJornadaLaboral
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
            DiaEspecialString = m.jornada.Dia ? null : m.jornada.DiaEspecial.ToString("dd/MM/yyyy"),
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

        if (existeAsignacion == 0)
        {
            var eliminarJornada = _context.JornadaLaboral.Find(JornadaLaboralID);
            _context.Remove(eliminarJornada);
            _context.SaveChanges();
            eliminado = true;
        }


        return Json(eliminado);
    }

    public JsonResult MostrarAsignacion(int? AsignacionJornadaID, string busqueda)
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

        // FILTRAR POR CUALQUIER CAMPO SI SE PROPORCIONA UN TÉRMINO DE BÚSQUEDA
        if (!string.IsNullOrEmpty(busqueda))
        {
            mostrarAsignacion = mostrarAsignacion.Where(p =>
            p.persona.NombreCompleto.Contains(busqueda) || 
            p.jornada.InfoJornada.ToString().Contains(busqueda) 
        ).ToList();
        }

        var vistaAsignacion = mostrarAsignacion.Select(v => new VistaAsignacion
        {
            AsignacionJornadaID = v.asignacion.AsignacionJornadaID,
            PersonaID = v.persona.PersonaID,
            PersonaNombre = v.persona.NombreCompleto,
            JornadaLaboralID = v.jornada.JornadaLaboralID,
            InfoJornada = v.jornada.InfoJornada
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
            resultado = "agg";
        }
        else
        {
            var editarAsignacion = _context.AsignacionJornadas.Where(e => e.AsignacionJornadaID == AsignacionJornadaID).SingleOrDefault();
            if (editarAsignacion != null)
            {
                editarAsignacion.PersonaID = PersonaID;
                editarAsignacion.JornadaLaboralID = JornadaLaboralID;
                _context.SaveChanges();
                resultado = "edit";
            }
        }


        return Json(resultado);
    }

    // public JsonResult EliminarAsignacion(int AsignacionJornadaID)
    // {
    //     var eliminar
    // }

}
