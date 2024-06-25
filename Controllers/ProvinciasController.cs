using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class ProvinciasController : Controller
{
    private ApplicationDbContext _context;

    public ProvinciasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Provincias()
    {
        return View();
    }

    public JsonResult ListadoProvincias(int? ProvinciaID)
    {
        var listadoProvincias = _context.Provincias.ToList();
        if (ProvinciaID != null)
        {
            listadoProvincias = _context.Provincias.Where(l => l.ProvinciaID == ProvinciaID).ToList();
        }

        return Json(listadoProvincias);
    }

    public JsonResult GuardarRegistros(int ProvinciaID, string Nombre)
    {
        string resultado = "";

        if(ProvinciaID == 0)
        {
            var nuevaProvincia = new Provincia
            {
                Nombre = Nombre
            };
            _context.Add(nuevaProvincia);
            _context.SaveChanges();
        }
        else
        {
            var provinciaEditar = _context.Provincias.Where(p => p.ProvinciaID == ProvinciaID).SingleOrDefault();
            if(provinciaEditar != null)
            {
                var existeProvincia = _context.Provincias.Where(e => e.Nombre == Nombre && e.ProvinciaID != ProvinciaID).Count();
                if (existeProvincia == 0)
                {
                    provinciaEditar.Nombre = Nombre;
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "YA EXISTE UN REGISTRO CON LA MISMA DESCRIPCIÓN";
                }
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
