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

    public IActionResult Graficos()
    {
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

}