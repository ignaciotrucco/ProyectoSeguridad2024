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

    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult Personas(string id)
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

        ViewBag.UsuarioID = id;

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

    public JsonResult ListadoPersonas(int? PersonaID, string busqueda, string RolBuscar)
    {
        // LISTADO COMPLETO DE PERSONAS CON SUS RELACIONES
        var listadoPersonas = _context.Personas
            .Include(l => l.Localidad)
            .Include(p => p.Localidad.Provincia)
            .Include(p => p.TipoDocumentos)
            .ToList();

        // FILTRAR POR ID DE PERSONA
        if (PersonaID != null)
        {
            listadoPersonas = listadoPersonas.Where(l => l.PersonaID == PersonaID).ToList();
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
            ).ToList();
        };

        // FILTRAR POR ROL SI SE SELECCIONA UNO
        if (!string.IsNullOrEmpty(RolBuscar))
        {
            var roleBuscar = _context.Roles.Where(r => r.Name == RolBuscar).SingleOrDefault();
            var personasConRol = _context.UserRoles.Where(u => u.RoleId == roleBuscar.Id).Select(ur => ur.UserId).ToList();


            listadoPersonas = listadoPersonas.Where(p => personasConRol.Contains(p.UsuarioID)).ToList();
        }

        List<VistaPersonas> personasMostrar = new List<VistaPersonas>();

        foreach (var persona in listadoPersonas)
        {
            var imagen = _context.Archivos.Where(i => i.ArchivoID == persona.ArchivoID).SingleOrDefault();

            var rolNombre = "";

            var rolUsuario = _context.UserRoles.Where(r => r.UserId == persona.UsuarioID).SingleOrDefault();
            if (rolUsuario != null)
            {
                rolNombre = _context.Roles.Where(l => l.Id == rolUsuario.RoleId).Select(r => r.Name).FirstOrDefault();
            }

            string base64 = "";
            string contentType = "";

            //VERIFICA SI EL ARCHIVO NO ES NULO
            if (imagen != null && imagen.ArchivoBinario != null)
            {
                base64 = Convert.ToBase64String(imagen.ArchivoBinario);
                contentType = imagen.ContentType;
            }

            var personaMostrar = new VistaPersonas
            {
                PersonaID = persona.PersonaID,
                LocalidadID = persona.LocalidadID,
                LocalidadNombre = persona.Localidad.Nombre,
                ProvinciaID = persona.Localidad.ProvinciaID,
                ProvinciaNombre = persona.Localidad.Provincia.Nombre,
                TipoDocumentoID = persona.TipoDocumentoID,
                TipoDocumentoNombre = persona.TipoDocumentos.Nombre,
                UsuarioID = persona.UsuarioID,
                NombreCompleto = persona.NombreCompleto,
                FechaNacimiento = persona.FechaNacimiento,
                FechaNacimientoString = persona.FechaNacimiento.ToString("dd/MM/yyyy"),
                Telefono = persona.Telefono,
                Domicilio = persona.Domicilio,
                Email = persona.Email,
                NumeroDocumento = persona.NumeroDocumento,
                EmailUsuario = _context.Users.Where(u => u.Id == persona.UsuarioID).Select(u => u.Email).FirstOrDefault(),
                RolPersona = rolNombre,
                ArchivoID = persona.ArchivoID,
                NombreArchivo = base64,
                ContentType = imagen?.ContentType
            };
            personasMostrar.Add(personaMostrar);
        }

        return Json(personasMostrar);
    }


    public async Task<IActionResult> GuardarPersonas(int PersonaID, int LocalidadID, int TipoDocumentoID, string EmailUsuario, string NombreCompleto, DateTime FechaNacimiento, string Telefono, string Domicilio, string Email, int NumeroDocumento, IFormFile ImagenPersona)
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

                if (ImagenPersona != null && ImagenPersona.Length > 0)
                {
                    var nuevaImagen = new Archivo
                    {
                        ArchivoBinario = await ConvertirAByteArray(ImagenPersona),
                        ContentType = ImagenPersona.ContentType,
                        NombreArchivo = ImagenPersona.FileName
                    };

                    //SI SE CARGA LO AGREGA AL CONTEXTO
                    _context.Archivos.Add(nuevaImagen);
                    await _context.SaveChangesAsync();

                    //ASOCIA EL ID DEL NUEVO ARCHIVO A LA PERSONA
                    nuevaPersona.ArchivoID = nuevaImagen.ArchivoID;
                    resultado = "<i class='fas fa-check-circle'></i> ¡Persona agregada correctamente!";
                }
                else
                {
                    resultado = "<i class='fas fa-check-circle'></i> ¡Persona agregada correctamente!";
                }

                _context.Add(nuevaPersona);
                await _context.SaveChangesAsync();
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


                    if (ImagenPersona != null && ImagenPersona.Length > 0)
                    {
                        var nuevaImagen = new Archivo
                        {
                            ArchivoBinario = await ConvertirAByteArray(ImagenPersona),
                            ContentType = ImagenPersona.ContentType,
                            NombreArchivo = ImagenPersona.FileName
                        };

                        _context.Archivos.Add(nuevaImagen);
                        await _context.SaveChangesAsync();

                        editarPersona.ArchivoID = nuevaImagen.ArchivoID;
                        resultado = "<i class='fas fa-check-circle'></i> ¡Persona editada correctamente!";

                    }
                    else
                    {
                        // editarPersona.ArchivoID = null;
                        resultado = "<i class='fas fa-check-circle'></i> ¡Persona editada correctamente!";
                    }

                    await _context.SaveChangesAsync();
                }
                else
                {
                    resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Persona existente!";
                }
            }
        }


        return Json(resultado);
    }

    private async Task<byte[]> ConvertirAByteArray(IFormFile archivo)
    {
        using (var memoryStream = new MemoryStream())
        {
            await archivo.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
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

