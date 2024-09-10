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

public class PersonasController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public PersonasController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public IActionResult Personas()
    {
        var tipoDocumentos = _context.TipoDocumentos.ToList();
        tipoDocumentos.Add(new TipoDocumento { TipoDocumentoID = 0, Nombre = "[ . . . ]" });
        ViewBag.TipoDocumentoID = new SelectList(tipoDocumentos.OrderBy(t => t.Nombre), "TipoDocumentoID", "Nombre");

        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        var localidades = _context.Localidades.ToList();
        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE UNA LOCALIDAD...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(t => t.Nombre), "LocalidadID", "Nombre");

        var usuarios = _context.Users.ToList();
        ViewBag.emailUsuario = new SelectList(usuarios.OrderBy(t => t.Email), "Email", "Email");

        return View();
    }

    public JsonResult GetLocalidades(int ProvinciaId)
    {
        var localidades = _context.Localidades
                                   .Where(l => l.ProvinciaID == ProvinciaId)
                                   .Select(l => new { l.LocalidadID, l.Nombre })
                                   .ToList();
        return Json(localidades);
    }

    public JsonResult ListadoPersonas(int? PersonaID, string busqueda)
    {
        // LISTADO COMPLETO DE PERSONAS CON SUS RELACIONES
        var listadoPersonas = _context.Personas
            .Include(l => l.Localidad)
            .Include(p => p.Localidad.Provincia)
            .Include(p => p.TipoDocumentos)
            .AsQueryable();

        // FILTRAR POR ID DE PERSONA
        if (PersonaID != null)
        {
            listadoPersonas = listadoPersonas.Where(l => l.PersonaID == PersonaID);
        }

        // FILTRAR POR CUALQUIER CAMPO SI SE PROPORCIONA UN TERMMINO DE BUSQUEDA
        if (!string.IsNullOrEmpty(busqueda))
        {

            listadoPersonas = listadoPersonas.Where(p =>
                p.NombreCompleto.Contains(busqueda) ||
                p.Localidad.Nombre.Contains(busqueda) ||
                p.Localidad.Provincia.Nombre.Contains(busqueda) ||
                p.TipoDocumentos.Nombre.Contains(busqueda) ||
                p.Telefono.Contains(busqueda) ||
                p.Email.Contains(busqueda) ||
                p.Domicilio.Contains(busqueda)
            );
        };

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
                NumeroDocumento = p.NumeroDocumento,
                EmailUsuario = _context.Users.Where(u => u.Id == p.UsuarioID).Select(u => u.Email).FirstOrDefault()
            }).ToList();

        return Json(personasMostrar);
    }


    public JsonResult GuardarPersonas(int PersonaID, int LocalidadID, int TipoDocumentoID, string EmailUsuario, string NombreCompleto, DateTime FechaNacimiento, string Telefono, string Domicilio, string Email, int NumeroDocumento)
    {
        var usuario = _userManager.FindByEmailAsync(EmailUsuario).Result;

        var UsuarioID = usuario.Id;

        string resultado = "";

        NombreCompleto = NombreCompleto.ToUpper();
        Domicilio = Domicilio.ToUpper();

        if (PersonaID == 0)
        {
            var existePersona = _context.Personas.Where(e => e.NumeroDocumento == NumeroDocumento || e.Telefono == Telefono).Count();
            if (existePersona == 0)
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
                resultado = "<i class='fas fa-check-circle'></i> ¡Persona agregada correctamente!";
            }
            else
            {
                resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Persona existente!";
            }
        }
        else
        {
            var editarPersona = _context.Personas.Where(e => e.PersonaID == PersonaID).SingleOrDefault();
            if (editarPersona != null)
            {
                var existePersonaEditar = _context.Personas.Where(e => e.NumeroDocumento == NumeroDocumento && e.PersonaID != PersonaID || e.Telefono == Telefono && e.PersonaID != PersonaID).Count();

                if (existePersonaEditar == 0)
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
                    resultado = "<i class='fas fa-check-circle'></i> ¡Persona editada correctamente!";
                }
                else
                {
                    resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Persona existente!";
                }
            }
        }


        return Json(resultado);
    }

    public JsonResult EliminarPersona(int PersonaID)
    {
        bool eliminado = false;

        var estaAsignada = _context.AsignacionJornadas.Where(e => e.PersonaID == PersonaID).Count();

        if (estaAsignada == 0)
        {
            var eliminarPersona = _context.Personas.Find(PersonaID);
            _context.Remove(eliminarPersona);
            _context.SaveChanges();
            eliminado = true;
        }

        return Json(eliminado);
    }

}

