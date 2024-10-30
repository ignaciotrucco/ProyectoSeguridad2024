using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class RubrosController : Controller
{
    private ApplicationDbContext _context;

    public RubrosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Rubros()
    {
        return View();
    }

    public JsonResult ListadoRubros(int? RubroID, string busqueda)
    {
        var listadoRubros = _context.Rubros.AsQueryable();
        if (RubroID != null)
        {
            listadoRubros = _context.Rubros.Where(l => l.RubroID == RubroID);
        }

        if (!string.IsNullOrEmpty(busqueda))
        {
            listadoRubros = listadoRubros.Where(l =>
            l.Nombre.Contains(busqueda)
            );
        }

        return Json(listadoRubros);
    }

    public JsonResult GuardarRubro(int RubroID, string NombreRubro)
    {
        string resultado = "";
        if (!String.IsNullOrEmpty(NombreRubro))
        {
            NombreRubro = NombreRubro.ToUpper();

            if (RubroID == 0)
            {
                var existeRubro = _context.Rubros.Where(e => e.Nombre == NombreRubro).Count();
                if (existeRubro == 0)
                {
                    var nuevoRubro = new Rubro
                    {
                        Nombre = NombreRubro
                    };
                    _context.Add(nuevoRubro);
                    _context.SaveChanges();
                    resultado = "<i class='fas fa-check-circle'></i> ¡Rubro agregado correctamente!";
                }
                else
                {
                    resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Rubro existente!";
                }
            }
            else
            {
                var rubroEditar = _context.Rubros.Where(p => p.RubroID == RubroID).SingleOrDefault();
                if (rubroEditar != null)
                {
                    var existeRubro = _context.Rubros.Where(e => e.Nombre == NombreRubro && e.RubroID != RubroID).Count();
                    if (existeRubro == 0)
                    {
                        rubroEditar.Nombre = NombreRubro;
                        _context.SaveChanges();
                        resultado = "<i class='fas fa-check-circle'></i> ¡Rubro editado correctamente!";
                    }
                    else
                    {
                        resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Rubro existente!";
                    }
                }
            }
        }
        else
        {
            resultado = "¡Debe ingresar un rubro!";
        }

        return Json(resultado);
    }

    public JsonResult EliminarRubro(int RubroID)
    {
        bool eliminado = false;

        var existeEmpresa = _context.Empresas.Where(e => e.RubroID == RubroID).Count();

        if (existeEmpresa == 0)
        {
            var eliminarRubro = _context.Rubros.Find(RubroID);
            _context.Remove(eliminarRubro);
            _context.SaveChanges();
            eliminado = true;
        }
        return Json(eliminado);
    }
}
