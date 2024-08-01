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
        tipoDocumentos.Add(new TipoDocumento {TipoDocumentoID = 0, Nombre = "[ . . . ]"});
        ViewBag.TipoDocumentoID = new SelectList(tipoDocumentos.OrderBy(t => t.Nombre), "TipoDocumentoID", "Nombre");

        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia {ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]"});
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        var localidades = _context.Localidades.ToList();
        localidades.Add(new Localidad {LocalidadID = 0, Nombre = "[SELECCIONE UNA LOCALIDAD...]"});
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(t => t.Nombre), "LocalidadID", "Nombre");

        // var usuarios = _context.Users.ToList();
        // usuarios.Add(new)

        return View();
    }

    public JsonResult GetLocalidades(int provinciaId)
    {
        var localidades = _context.Localidades
                                   .Where(l => l.ProvinciaID == provinciaId)
                                   .Select(l => new { l.LocalidadID, l.Nombre })
                                   .ToList();
        return Json(localidades);
    }

public JsonResult ListadoPersonas(int? PersonaID)
{
    var listadoPersonas = _context.Personas.Include(l => l.Localidad).Include(p => p.Localidad.Provincia).Include(p => p.TipoDocumentos).ToList();

    if (PersonaID != null)
    {
        listadoPersonas = _context.Personas.Where(l => l.PersonaID == PersonaID).ToList();
    }

    var personasMostrar = listadoPersonas
    .Select(p => new VistaPersonas
    {
        PersonaID = p.PersonaID,
        LocalidadID = p.LocalidadID,
        LocalidadNombre = p.Localidad.Nombre,
        ProvinciaID = p.Localidad.ProvinciaID,
        ProvinciaNombre = p.Localidad.Provincia.Nombre,
        TipoDocumentoID = p.TipoDocumentoID,
        TipoDocumentoNombre = p.TipoDocumentos.Nombre,
        UsuarioID = p.UsuarioID,
        NombreCompleto = p.NombreCompleto,
        FechaNacimiento = p.FechaNacimiento,
        FechaNacimientoString = p.FechaNacimiento.ToString("dd/MM/yyyy"),
        Telefono = p.Telefono,
        Domicilio = p.Domicilio,
        Email = p.Email,
        NumeroDocumento = p.NumeroDocumento
    }).ToList();

    return Json(personasMostrar);
}

public JsonResult GuardarPersonas(int PersonaID, int LocalidadID, int TipoDocumentoID, string UsuarioID, string NombreCompleto, DateTime FechaNacimiento, string Telefono, string Domicilio, string Email, int NumeroDocumento)
{
    string resultado = "";

    NombreCompleto = NombreCompleto.ToUpper();
    Domicilio = Domicilio.ToUpper();

    if (PersonaID == 0)
    {
        var existeNombrePersona = _context.Personas.Where(e => e.NombreCompleto == NombreCompleto).Count();
        if(existeNombrePersona == 0)
        {
            var nuevaPersona = new Persona 
            {
                PersonaID = PersonaID,
                LocalidadID = LocalidadID,
                TipoDocumentoID = TipoDocumentoID,
                UsuarioID = UsuarioID,
                NombreCompleto = NombreCompleto,
                FechaNacimiento = FechaNacimiento,
                Telefono = Telefono,
                Domicilio = Domicilio,
                Email = Email,
                NumeroDocumento = NumeroDocumento
            };
            _context.Add(nuevaPersona);
            _context.SaveChanges();
            resultado = "¡Persona agregada correctamente!";
        }
        else
        {
            resultado = "Persona existente";
        }
    }
    else
    {
        var editarPersona = _context.Personas.Where(e => e.PersonaID == PersonaID).SingleOrDefault();
        if (editarPersona != null)
        {
            editarPersona.LocalidadID = LocalidadID;
            editarPersona.TipoDocumentoID = TipoDocumentoID;
            editarPersona.UsuarioID = UsuarioID;
            editarPersona.NombreCompleto = NombreCompleto;
            editarPersona.FechaNacimiento = FechaNacimiento;
            editarPersona.Telefono = Telefono;
            editarPersona.Domicilio = Domicilio;
            editarPersona.Email = Email;
            editarPersona.NumeroDocumento = NumeroDocumento;
            _context.SaveChanges();
            resultado = "¡Persona editada correctamente!";
        }
    }


    return Json(resultado);
}

public JsonResult EliminarPersona(int PersonaID)
{
    var eliminarPersona = _context.Personas.Find(PersonaID);
    _context.Remove(eliminarPersona);
    _context.SaveChanges();

    return Json(eliminarPersona);
}
    
}
