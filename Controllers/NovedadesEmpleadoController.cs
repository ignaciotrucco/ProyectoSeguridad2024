using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class NovedadesEmpleadoController : Controller
{
    private ApplicationDbContext _context;

    public NovedadesEmpleadoController(ApplicationDbContext context)
    {
        _context = context;
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

