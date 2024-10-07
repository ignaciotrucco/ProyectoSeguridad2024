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

public class DevolucionesController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public DevolucionesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public IActionResult Devoluciones()
    {

        return View();
    }

    public IActionResult NuevaDevolucion()
    {

        return View();
    }

    public JsonResult Devolucion(int? DevolucionID)
    {

        List<VistaDevolucion> VistaDevolucion = new List<VistaDevolucion>();

        var listadoDevoluciones = _context.Devoluciones.ToList();

        //FILTRAR POR ID
        if (DevolucionID != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.DevolucionID == DevolucionID).ToList();
        }

        foreach (var listadoDevolucion in listadoDevoluciones)
        {
            var persona = _context.Personas.SingleOrDefault(p => p.UsuarioID == listadoDevolucion.UsuarioID);

            var vistaDevolucion = new VistaDevolucion
            {
                DevolucionID = listadoDevolucion.DevolucionID,
                UsuarioID = listadoDevolucion.UsuarioID,
                Reseña = listadoDevolucion.Reseña,
                ClienteNombre = persona?.NombreCompleto,
                Fecha_Hora = listadoDevolucion.Fecha_Hora,
                FechaHora = listadoDevolucion.Fecha_Hora.ToString("dddd dd MMM yyyy - HH:mm"),

            };

            VistaDevolucion.Add(vistaDevolucion);
        }

        return Json(VistaDevolucion);
    }


  public async Task<IActionResult> CargarObservacion(int DevolucionID, DateTime Fecha_Hora, string Reseña)
    {
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);
        string resultado = "";

        // Verifica que se haya proporcionado una Reseña
        if (!string.IsNullOrEmpty(Reseña))
        {
            // Crea una nueva Reseña
            var nuevaDevolucion = new Devolucion
            {
                Fecha_Hora = Fecha_Hora,
                Reseña = Reseña,
                UsuarioID = usuarioLogueadoID
            };

            _context.Devoluciones.Add(nuevaDevolucion);
            await _context.SaveChangesAsync(); // Guarda los cambios de la devolucion

        }
        else
        {
            resultado = "Debe cargar una reseña";
        }

        return Json(resultado);
    }

}