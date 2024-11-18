using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]
public class GraficosController : Controller
{
    private ApplicationDbContext _context;

    public GraficosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult Graficos()
    {
        var empleados = _context.Personas
    .Join(_context.Users, persona => persona.UsuarioID, user => user.Id,
        (persona, user) => new { persona.PersonaID, persona.NombreCompleto, user.Id })
    .Join(_context.UserRoles, personaUser => personaUser.Id, userRole => userRole.UserId,
        (personaUser, userRole) => new { personaUser.PersonaID, personaUser.NombreCompleto, userRole.RoleId })
    .Join(_context.Roles, userRole => userRole.RoleId, role => role.Id,
        (userRole, role) => new { userRole.PersonaID, userRole.NombreCompleto, role.Name })
    .Where(x => x.Name == "EMPLEADO")
    .Select(x => new { x.PersonaID, x.NombreCompleto })
    .ToList();

        // Agregar un elemento "Todos" al principio de la lista
        empleados.Insert(0, new { PersonaID = 0, NombreCompleto = "[TODOS]" });

        ViewBag.PersonaID = new SelectList(empleados, "PersonaID", "NombreCompleto");


        return View();
    }


    public JsonResult GraficoTortaEmpresasPorLocalidad()
    {
        var vistaEmpresasPorLocalidad = new List<VistaEmpresasPorLocalidad>();

        var localidades = _context.Localidades.ToList();

        foreach (var localidad in localidades)
        {
            var empresas = _context.Empresas.Where(e => e.LocalidadID == localidad.LocalidadID).ToList();

            // SI HAY EMPRESAS ASOCIADAS, LAS AGREGAMOS A LA LISTA
            if (empresas.Any())
            {
                var localidadEmpresas = new VistaEmpresasPorLocalidad
                {
                    LocalidadID = localidad.LocalidadID,
                    NombreLocalidad = localidad.Nombre,
                    CantidadEmpresas = empresas.Count()
                };
                vistaEmpresasPorLocalidad.Add(localidadEmpresas);
            }
        }

        return Json(vistaEmpresasPorLocalidad);
    }


    public JsonResult GraficoHistorialFichajes(int? PersonaID, DateTime? FechaDesde, DateTime? FechaHasta)
    {
        var listadoTurnos = _context.TurnoLaboral.AsQueryable();

        // Filtros por persona y fechas
        if (PersonaID.HasValue && PersonaID.Value > 0)
        {
            var persona = _context.Personas.Find(PersonaID.Value);
            if (persona != null)
            {
                listadoTurnos = listadoTurnos.Where(l => l.UsuarioID == persona.UsuarioID);
            }
        }

        if (FechaDesde.HasValue && FechaHasta.HasValue)
        {
            listadoTurnos = listadoTurnos.Where(l => l.FechaFichaje >= FechaDesde && l.FechaFichaje <= FechaHasta);
        }

        // Cálculo de los porcentajes
        var totalFichajes = listadoTurnos.Count();
        var fichajesEnHorario = listadoTurnos.Count(l => l.Estado);
        var fichajesFueraHorario = totalFichajes - fichajesEnHorario;

        var resultados = new
        {
            EnHorario = totalFichajes > 0 ? (fichajesEnHorario * 100.0) / totalFichajes : 0,
            FueraHorario = totalFichajes > 0 ? (fichajesFueraHorario * 100.0) / totalFichajes : 0
        };

        return Json(resultados);
    }

    public JsonResult GraficoTortaEmpresasPorRubro()
    {
        var vistaEmpresasPorRubro = _context.Rubros
            .Select(r => new
            {
                RubroID = r.RubroID,
                NombreRubro = r.Nombre,
                CantidadEmpresas = r.Empresas.Count()
            })
            .Where(r => r.CantidadEmpresas > 0)
            .ToList();

        return Json(vistaEmpresasPorRubro);
    }



}