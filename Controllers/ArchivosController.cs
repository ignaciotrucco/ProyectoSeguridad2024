using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;

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
}

public class ArchivoController : Controller
{
    private readonly ApplicationDbContext _context;

    public ArchivoController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> GuardarArchivo(int personaEmisorID, int personaReceptorID, IFormFile archivo)
    {
        try
        {
            if (archivo != null && archivo.Length > 0)
            {
                var nuevoArchivo = new Archivo
                {
                    ArchivoBinario = await ConvertirAByteArray(archivo),
                    ContentType = archivo.ContentType,
                    NombreArchivo = archivo.FileName
                };

                _context.Archivos.Add(nuevoArchivo);
                await _context.SaveChangesAsync();

                var nuevoEnvioArchivo = new EnvioArchivo
                {
                    PersonaEmisorID = personaEmisorID,
                    PersonaReceptorID = personaReceptorID,
                    ArchivoID = nuevoArchivo.ArchivoID
                };

                _context.EnvioArchivos.Add(nuevoEnvioArchivo);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Archivo guardado exitosamente." });
            }
            else
            {
                return Json(new { success = false, message = "No se seleccionó ningún archivo." });
            }
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = "Ocurrió un error al guardar el archivo: " + ex.Message });
        }
    }

    private async Task<byte[]> ConvertirAByteArray(IFormFile archivo)
    {
        using (var memoryStream = new MemoryStream())
        {
            await archivo.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
    }
public JsonResult ListadoNovedades(int? ArchivoID)
{
    var listadoNovedades = _context.Archivos.ToList();
    
    if (ArchivoID != null)
    {
        listadoNovedades = _context.Archivos.Where(l => l.ArchivoID == ArchivoID).ToList();
    }

    return Json(listadoNovedades);
}

}
