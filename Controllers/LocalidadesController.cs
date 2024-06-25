using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class LocalidadesController : Controller
{
    private ApplicationDbContext _context;

    public LocalidadesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Localidades()
    {
        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia {ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]"});
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        return View();
    }

    public JsonResult ListadoLocalidades(int? LocalidadID)
    {
        var listadoLocalidades = _context.Localidades.ToList();
        if (LocalidadID != null)
        {
            listadoLocalidades = _context.Localidades.Where(l => l.LocalidadID == LocalidadID).ToList();
        }

        return Json(listadoLocalidades);
    }

    public JsonResult GuardarLocalidad(int LocalidadID, int ProvinciaID, string Nombre, string CodigoPostal)
    {
        string resultado = "";

        if(LocalidadID == 0)
        {
            var nuevaLocalidad = new Localidad
            {
                ProvinciaID = ProvinciaID,
                Nombre = Nombre,
                CodigoPostal = CodigoPostal
            };
            _context.Add(nuevaLocalidad);
            _context.SaveChanges();
            resultado = "agregada";
        }
        else
        {
            var localidadEditar = _context.Localidades.Where(p => p.LocalidadID == LocalidadID).SingleOrDefault();
            if(localidadEditar != null)
            {
                localidadEditar.ProvinciaID = ProvinciaID;
                localidadEditar.Nombre = Nombre;
                localidadEditar.CodigoPostal = CodigoPostal;
                _context.SaveChanges();
                resultado = "editada";
            }
        }

        return Json(resultado);
    }

public JsonResult EliminarRegistros(int ProvinciaID)
{
    var eliminarProvincia = _context.Provincias.Find(ProvinciaID);
    _context.Remove(eliminarProvincia);
    _context.SaveChanges();

    return Json(eliminarProvincia);
}
}
