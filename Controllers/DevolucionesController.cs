using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

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
    public IActionResult HistorialDevoluciones()
    {

        return View();
    }

    //LISTADO PARA QUE EL ADMIN VEA TODAS LAS RESEÑAS
    public JsonResult ListadoHistorialDevoluciones(int? DevolucionID)
    {
        List<VistaClienteDevolucion> VistaClienteDevolucion = new List<VistaClienteDevolucion>();

        var listadoDevoluciones = _context.Devoluciones.ToList();
        var empresas = _context.Empresas.ToList();

        //FILTRAR POR ID
        if (DevolucionID != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.DevolucionID == DevolucionID).ToList();
        }

        foreach (var listadoDevolucion in listadoDevoluciones)
        {
            var empresa = empresas.Where(p => p.UsuarioID == listadoDevolucion.UsuarioID).SingleOrDefault();

            if (empresa != null)
            {
                var empresasMostrar = VistaClienteDevolucion.Where(e => e.UsuarioID == listadoDevolucion.UsuarioID).SingleOrDefault();

                if (empresasMostrar == null)
                {
                    empresasMostrar = new VistaClienteDevolucion
                    {
                        DevolucionID = listadoDevolucion.DevolucionID,
                        UsuarioID = listadoDevolucion.UsuarioID,
                        ClienteNombre = empresa.RazonSocial,
                        VistaDevolucion = new List<VistaDevolucion>()
                    };
                    VistaClienteDevolucion.Add(empresasMostrar);
                }

                var vistaDevolucion = new VistaDevolucion
                {
                    DevolucionID = listadoDevolucion.DevolucionID,
                    Reseña = listadoDevolucion.Reseña,
                    Fecha_Hora = listadoDevolucion.Fecha_Hora,
                    FechaHora = listadoDevolucion.Fecha_Hora.ToString("dddd dd MMM yyyy - HH:mm"),
                    Encuesta = listadoDevolucion.Encuesta
                };

                empresasMostrar.VistaDevolucion.Add(vistaDevolucion);
            }

        }

        return Json(VistaClienteDevolucion);
    }

    //LISTADO PARA QUE EL CLIENTE VEA SUS PROPIAS RESEÑAS
    public JsonResult Devolucion(int? DevolucionID, DateTime? FechaDesde, DateTime? FechaHasta)
    {
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        List<VistaDevolucion> VistaDevolucion = new List<VistaDevolucion>();

        var listadoDevoluciones = _context.Devoluciones.ToList();

        //FILTRAR POR ID
        if (DevolucionID != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.DevolucionID == DevolucionID).ToList();
        }

        if (FechaDesde != null && FechaHasta != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.Fecha_Hora >= FechaDesde && l.Fecha_Hora <= FechaHasta).ToList();
        }

        foreach (var listadoDevolucion in listadoDevoluciones)
        {
            var empresa = _context.Empresas.SingleOrDefault(p => p.UsuarioID == listadoDevolucion.UsuarioID);

            if (listadoDevolucion.UsuarioID == usuarioLogueadoID)
            {
                var vistaDevolucion = new VistaDevolucion
                {
                    DevolucionID = listadoDevolucion.DevolucionID,
                    UsuarioID = listadoDevolucion.UsuarioID,
                    Reseña = listadoDevolucion.Reseña,
                    ClienteNombre = empresa?.RazonSocial,
                    Fecha_Hora = listadoDevolucion.Fecha_Hora,
                    FechaHora = listadoDevolucion.Fecha_Hora.ToString("dddd dd MMM yyyy - HH:mm"),
                    Encuesta = listadoDevolucion.Encuesta
                };

                VistaDevolucion.Add(vistaDevolucion);
            }
        }

        return Json(VistaDevolucion);
    }


    public async Task<IActionResult> CargarObservacion(int DevolucionID, string Resenia, string Encuesta)
    {
        var usuarioLogueadoID = _userManager.GetUserId(HttpContext.User);

        // Verifica que se haya proporcionado una Reseña
        if (!string.IsNullOrEmpty(Resenia) && !string.IsNullOrEmpty(Encuesta))
        {
            // Crea una nueva Reseña
            var nuevaDevolucion = new Devolucion
            {
                Fecha_Hora = DateTime.Now,
                Reseña = Resenia,
                UsuarioID = usuarioLogueadoID,
                Encuesta = Encuesta
            };

            _context.Devoluciones.Add(nuevaDevolucion);
            await _context.SaveChangesAsync(); // Guarda los cambios de la devolucion
            return Json(new { success = true, Message = "La devolución se envió correctamente!" });
        }
        else
        {
            return Json(new { success = false, Message = "Debe completar la encuesta." });
        }
    }

}