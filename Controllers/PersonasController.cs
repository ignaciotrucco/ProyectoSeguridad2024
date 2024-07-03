using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class PersonasController : Controller
{
    private ApplicationDbContext _context;

    public PersonasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Personas()
    {
        var tipoDocumentos = _context.TipoDocumentos.ToList();
        tipoDocumentos.Add(new TipoDocumento {TipoDocumentoID = 0, Nombre = "[SELECCIONE...]"});
        ViewBag.TipoDocumentoID = new SelectList(tipoDocumentos.OrderBy(t => t.Nombre), "TipoDocumentoID", "Nombre");

        var localidades = _context.Localidades.ToList();
        localidades.Add(new Localidad {LocalidadID = 0, Nombre = "[SELECCIONE UNA LOCALIDAD...]"});
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(t => t.Nombre), "LocalidadID", "Nombre");

        return View();
    }

public JsonResult ListadoPersonas(int? PersonaID)
{
    var listadoPersonas = _context.Personas.ToList();

    if (PersonaID != null)
    {
        listadoPersonas = _context.Personas.Where(l => l.PersonaID == PersonaID).ToList();
    }

    return Json(listadoPersonas);
}
    
}
