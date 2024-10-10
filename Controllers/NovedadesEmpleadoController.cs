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
        var empresa = _context.Empresas.ToList();
        empresa.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE...]" });
        ViewBag.EmpresaID = new SelectList(empresa.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

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
                resultado = "Novedad cargada exitosamente";
            }
            else
            {
                //SI NO SE CARGA EL ARCHVIO GUARDA LA NOVEDAD SIMPLE
                resultado = "Novedad cargada exitosamente!";
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
}

// public async Task<IActionResult> GuardarArchivo(int personaEmisorID, int personaReceptorID, IFormFile archivo)
// {
//     try
//     {
//         if (archivo != null && archivo.Length > 0)
//         {
//             var nuevoArchivo = new Archivo
//             {
//                 ArchivoBinario = await ConvertirAByteArray(archivo),
//                 ContentType = archivo.ContentType,
//                 NombreArchivo = archivo.FileName
//             };

//             _context.Archivos.Add(nuevoArchivo);
//             await _context.SaveChangesAsync();

//             var nuevoEnvioArchivo = new EnvioArchivo
//             {
//                 PersonaEmisorID = personaEmisorID,
//                 PersonaReceptorID = personaReceptorID,
//                 ArchivoID = nuevoArchivo.ArchivoID
//             };

//             _context.EnvioArchivos.Add(nuevoEnvioArchivo);
//             await _context.SaveChangesAsync();

//             return Json(new { success = true, message = "Archivo guardado exitosamente." });
//         }
//         else
//         {
//             return Json(new { success = false, message = "No se seleccionó ningún archivo." });
//         }
//     }
//     catch (Exception ex)
//     {
//         return Json(new { success = false, message = "Ocurrió un error al guardar el archivo: " + ex.Message });
//     }
// }

// private async Task<byte[]> ConvertirAByteArray(IFormFile archivo)
// {
//     using (var memoryStream = new MemoryStream())
//     {
//         await archivo.CopyToAsync(memoryStream);
//         return memoryStream.ToArray();
//     }
// }

