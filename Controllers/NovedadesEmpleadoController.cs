using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class NovedadesEmpleadoController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public NovedadesEmpleadoController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public IActionResult NovedadesEmpleado()
    {
        return View();
    }

    public IActionResult NuevaNovedad()
    {
        var usuarioLogueado = _userManager.GetUserId(HttpContext.User);

        var persona = _context.Personas.Where(p => p.UsuarioID == usuarioLogueado).FirstOrDefault();

        var personaID = persona?.PersonaID;

        var empresasAsignadas = (from jornada in _context.JornadaLaboral
                                 join asignacion in _context.AsignacionJornadas
                                 on jornada.JornadaLaboralID equals asignacion.JornadaLaboralID
                                 where asignacion.PersonaID == personaID
                                 select new Empresa
                                 {
                                     EmpresaID = jornada.EmpresaID,
                                     RazonSocial = _context.Empresas
                                         .Where(e => e.EmpresaID == jornada.EmpresaID)
                                         .Select(e => e.RazonSocial)
                                         .FirstOrDefault()
                                 }).ToList();

        empresasAsignadas.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE...]" });
        ViewBag.EmpresaID = new SelectList(empresasAsignadas.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

        return View();
    }

    public IActionResult HistorialNovedades()
    {
        var personas = (from persona in _context.Personas
                        join user in _context.Users on persona.UsuarioID equals user.Id
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        where role.Name == "EMPLEADO"
                        select persona).ToList();

        personas.Add(new Persona { PersonaID = 0, NombreCompleto = "[TODOS]" });
        ViewBag.PersonaID = new SelectList(personas.OrderBy(t => t.NombreCompleto), "PersonaID", "NombreCompleto");

        return View();
    }

    public JsonResult Novedades(int? NovedadID, DateTime? FechaDesde, DateTime? FechaHasta)
    {
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);
        List<VistaNovedad> VistaNovedad = new List<VistaNovedad>();

        var listadoNovedades = _context.Novedades.ToList();

        //FILTRAR POR ID
        if (NovedadID != null)
        {
            listadoNovedades = listadoNovedades.Where(l => l.NovedadID == NovedadID).ToList();
        }

        if (FechaDesde != null && FechaHasta != null)
        {
            listadoNovedades = listadoNovedades.Where(l => l.Fecha_Hora >= FechaDesde && l.Fecha_Hora <= FechaHasta).ToList();
        }

        foreach (var listadoNovedad in listadoNovedades)
        {
            var persona = _context.Personas.SingleOrDefault(p => p.UsuarioID == listadoNovedad.UsuarioID);
            var empresa = _context.Empresas.SingleOrDefault(e => e.EmpresaID == listadoNovedad.EmpresaID);
            var archivo = _context.Archivos.SingleOrDefault(a => a.ArchivoID == listadoNovedad.ArchivoID);

            string base64 = "";
            string contentType = "";

            //VERIFICA SI EL ARCHIVO NO ES NULO
            if (archivo != null && archivo.ArchivoBinario != null)
            {
                base64 = Convert.ToBase64String(archivo.ArchivoBinario);
                contentType = archivo.ContentType;
            }

            if (listadoNovedad.UsuarioID == usuarioLogueadoID)
            {
                var vistaNovedad = new VistaNovedad
                {
                    NovedadID = listadoNovedad.NovedadID,
                    UsuarioID = listadoNovedad.UsuarioID,
                    ArchivoID = listadoNovedad.ArchivoID,
                    Observacion = listadoNovedad.Observacion,
                    PersonaNombre = persona?.NombreCompleto,
                    EmpresaID = listadoNovedad.EmpresaID,
                    EmpresaNombre = empresa?.RazonSocial,
                    Fecha_Hora = listadoNovedad.Fecha_Hora,
                    FechaHora = listadoNovedad.Fecha_Hora.ToString("dddd dd MMM yyyy - HH:mm"),
                    NombreArchivo = base64,
                    ContentType = archivo?.ContentType
                };

                VistaNovedad.Add(vistaNovedad);
            }
        }

        return Json(VistaNovedad);
    }


    public async Task<IActionResult> CargarNovedad(int NovedadID, int EmpresaID, DateTime Fecha_Hora, string Observacion, IFormFile Archivo)
    {
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);
        string resultado = "";

        //VERIFICA QUE INGRESE UNA OBSERVACION
        if (!string.IsNullOrEmpty(Observacion))
        {
            // Crea una nueva novedad
            var nuevaNovedad = new Novedad
            {
                EmpresaID = EmpresaID,
                Fecha_Hora = Fecha_Hora,
                Observacion = Observacion,
                UsuarioID = usuarioLogueadoID
            };

            //VERIFICA SI SE CARGA UN ARCHIVO
            if (Archivo != null && Archivo.Length > 0)
            {
                var nuevoArchivo = new Archivo
                {
                    ArchivoBinario = await ConvertirAByteArray(Archivo),
                    ContentType = Archivo.ContentType,
                    NombreArchivo = Archivo.FileName
                };

                //SI SE CARGA LO AGREGA AL CONTEXTO
                _context.Archivos.Add(nuevoArchivo);
                await _context.SaveChangesAsync();

                //ASOCIA EL ID DEL NUEVO ARCHIVO A LA NOVEDAD
                nuevaNovedad.ArchivoID = nuevoArchivo.ArchivoID;
                resultado = "<i class='fas fa-check-circle'></i> ¡Novedad cargada exitosamente!";
            }
            else
            {
                //SI NO SE CARGA EL ARCHVIO GUARDA LA NOVEDAD SIMPLE
                resultado = "<i class='fas fa-check-circle'></i> ¡Novedad cargada exitosamente!";
            }

            //AGREGA LA NOVEDAD AL CONTEXTO
            _context.Novedades.Add(nuevaNovedad);
            await _context.SaveChangesAsync(); // GUARDA LOS CAMBIOS
        }
        else
        {
            resultado = "Debe cargar una observacion";
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

    //LISTADO PARA QUE EL ADMIN VEA TODAS LAS RESEÑAS
    public JsonResult ListadoHistorialNovedades(int? NovedadID, int? Persona, DateTime? FechaDesdeHistorial, DateTime? FechaHastaHistorial)
    {
        List<VistaEmpleadoNovedad> VistaEmpleadoNovedad = new List<VistaEmpleadoNovedad>();

        var listadoNovedades = _context.Novedades.ToList();
        var personas = _context.Personas.ToList();
        var empresas = _context.Empresas.ToList();

        //FILTRAR POR ID
        if (NovedadID != null)
        {
            listadoNovedades = listadoNovedades.Where(l => l.NovedadID == NovedadID).ToList();
        }

        if (Persona != 0 && Persona != null)
        {
            //BUSCAR LA PERSONA CORRESPONDIENTE AL EMPLEADO PROPORCIONADO
            var personaFiltrada = personas.Where(p => p.PersonaID == Persona).SingleOrDefault();

            if (personaFiltrada != null)
            {
                //FILTRADO POR EMPLEADO
                listadoNovedades = listadoNovedades.Where(l => l.UsuarioID == personaFiltrada.UsuarioID).ToList();
            }
        }

        if (FechaDesdeHistorial != null && FechaHastaHistorial != null)
        {
            listadoNovedades = listadoNovedades.Where(l => l.Fecha_Hora >= FechaDesdeHistorial && l.Fecha_Hora <= FechaHastaHistorial).ToList();
        }

        foreach (var listadoNovedade in listadoNovedades)
        {
            var empleado = personas.Where(p => p.UsuarioID == listadoNovedade.UsuarioID).Single();
            var empresa = empresas.Where(e => e.EmpresaID == listadoNovedade.EmpresaID).Single();
            var archivo = _context.Archivos.Where(a => a.ArchivoID == listadoNovedade.ArchivoID).SingleOrDefault();

            string base64 = "";
            string contentType = "";

            //VERIFICA SI EL ARCHIVO NO ES NULO
            if (archivo != null && archivo.ArchivoBinario != null)
            {
                base64 = Convert.ToBase64String(archivo.ArchivoBinario);
                contentType = archivo.ContentType;
            }

            if (empleado != null)
            {
                var empleadoMostrar = VistaEmpleadoNovedad.Where(e => e.UsuarioID == listadoNovedade.UsuarioID).SingleOrDefault();

                if (empleadoMostrar == null)
                {
                    empleadoMostrar = new VistaEmpleadoNovedad
                    {
                        NovedadID = listadoNovedade.NovedadID,
                        UsuarioID = listadoNovedade.UsuarioID,
                        PersonaID = empleado.PersonaID,
                        NombreEmpleado = empleado.NombreCompleto,
                        VistaEmpresa = new List<VistaEmpresa>()
                    };
                    VistaEmpleadoNovedad.Add(empleadoMostrar);
                }

                var empresaMostrar = empleadoMostrar.VistaEmpresa.Where(e => e.EmpresaID == listadoNovedade.EmpresaID).SingleOrDefault();

                if (empresaMostrar == null) {
                    empresaMostrar = new VistaEmpresa {
                        EmpresaID = listadoNovedade.EmpresaID,
                        EmpresaNombre = empresa.RazonSocial,
                        VistaNovedad = new List<VistaNovedad>()
                    };
                    empleadoMostrar.VistaEmpresa.Add(empresaMostrar);
                }

                var vistaNovedad = new VistaNovedad
                {
                    NovedadID = listadoNovedade.NovedadID,
                    ArchivoID = listadoNovedade.ArchivoID,
                    Fecha_Hora = listadoNovedade.Fecha_Hora,
                    FechaHora = listadoNovedade.Fecha_Hora.ToString("dddd dd MMM yyyy - HH:mm"),
                    Observacion = listadoNovedade.Observacion,
                    ContentType = contentType,
                    NombreArchivo = base64,
                };

                empresaMostrar.VistaNovedad.Add(vistaNovedad);
            }

        }

        return Json(VistaEmpleadoNovedad);
    }

}


