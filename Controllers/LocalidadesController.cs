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
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        return View();
    }

    public JsonResult ListadoLocalidades(int? LocalidadID, string busqueda)
    {
        var listadoLocalidades = _context.Localidades.Include(l => l.Provincia).AsQueryable();
        if (LocalidadID != null)
        {
            listadoLocalidades = _context.Localidades.Where(l => l.LocalidadID == LocalidadID);
        }

        if (!string.IsNullOrEmpty(busqueda))
        {

            listadoLocalidades = listadoLocalidades.Where(l => l.Nombre.Contains(busqueda) ||
            l.CodigoPostal.Contains(busqueda) ||
            l.Provincia.Nombre.Contains(busqueda)
            );

        };

        var localidadesMostrar = listadoLocalidades.Select(l => new VistaLocalidades
        {
            LocalidadID = l.LocalidadID,
            ProvinciaID = l.ProvinciaID,
            Nombre = l.Nombre,
            ProvinciaNombre = l.Provincia.Nombre,
            CodigoPostal = l.CodigoPostal
        }).ToList();

        return Json(localidadesMostrar);
    }

    public JsonResult GuardarLocalidad(int LocalidadID, int ProvinciaID, string Nombre, string CodigoPostal)
    {
        string resultado = "";

        Nombre = Nombre.ToUpper();

        if (LocalidadID == 0)
        {
            // var existeNombreLocalidad = _context.Localidades.Where(e => e.Nombre == Nombre).Count();
            // if (existeNombreLocalidad == 0)
            {
                var nuevaLocalidad = new Localidad
                {
                    ProvinciaID = ProvinciaID,
                    Nombre = Nombre,
                    CodigoPostal = CodigoPostal
                };
                _context.Add(nuevaLocalidad);
                _context.SaveChanges();
                resultado = "<i class='fas fa-check-circle'></i> ¡Localidad agregada correctamente!";
            }
            // else
            // {
            //     resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Localidad existente!";
            // }
        }
        else
        {
            var localidadEditar = _context.Localidades.Where(p => p.LocalidadID == LocalidadID).SingleOrDefault();
            if (localidadEditar != null)
            {
                // var existeLocalidadEditar = _context.Localidades.Where(e => e.Nombre == Nombre && e.LocalidadID != LocalidadID).Count();
                // if (existeLocalidadEditar == 0)
                {
                    localidadEditar.ProvinciaID = ProvinciaID;
                    localidadEditar.Nombre = Nombre;
                    localidadEditar.CodigoPostal = CodigoPostal;
                    _context.SaveChanges();
                    resultado = "<i class='fas fa-check-circle'></i> ¡Localidad editada correctamente!";
                }
                // else {
                //     resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Localidad existente!";
                // }
            }
        }

        return Json(resultado);
    }

    public JsonResult EliminarLocalidad(int LocalidadID)
    {
        bool eliminado = false;

        var existePersona = _context.Personas.Where(e => e.LocalidadID == LocalidadID).Count();

        if (existePersona == 0)
        {
            var eliminarLocalidad = _context.Localidades.Find(LocalidadID);
            _context.Remove(eliminarLocalidad);
            _context.SaveChanges();
            eliminado = true;
        }

        return Json(eliminado);
    }
}
