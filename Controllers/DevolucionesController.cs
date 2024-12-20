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
    [Authorize(Roles = "CLIENTE")]
    public IActionResult Devoluciones()
    {

        return View();
    }

    [Authorize(Roles = "CLIENTE")]
    public IActionResult NuevaDevolucion()
    {

        return View();
    }

    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult HistorialDevoluciones()
    {
        var empresa = _context.Empresas.ToList();
        empresa.Add(new Empresa { EmpresaID = 0, RazonSocial = "[SELECCIONE . . ]" });
        ViewBag.EmpresaID = new SelectList(empresa.OrderBy(t => t.RazonSocial), "EmpresaID", "RazonSocial");

        return View();
    }

    //LISTADO PARA QUE EL ADMIN VEA TODAS LAS RESEÑAS
    public JsonResult ListadoHistorialDevoluciones(int? DevolucionID, int? Cliente, DateTime? FechaDesdeHistorial, DateTime? FechaHastaHistorial)
    {
        List<VistaClienteDevolucion> VistaClienteDevolucion = new List<VistaClienteDevolucion>();

        var listadoDevoluciones = _context.Devoluciones.ToList();
        var empresas = _context.Empresas.ToList();

        //FILTRAR POR ID
        if (DevolucionID != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.DevolucionID == DevolucionID).ToList();
        }

        if (Cliente != 0 && Cliente != null)
        {
            //BUSCAR LA EMPRESA CORRESPONDIENTE AL CLIENTE PROPORCIONADO
            var empresaFiltrada = empresas.SingleOrDefault(p => p.EmpresaID == Cliente);

            if (empresaFiltrada != null)
            {
                //FILTRADO POR EMPRESAS
                listadoDevoluciones = listadoDevoluciones.Where(l => l.UsuarioID == empresaFiltrada.UsuarioID).ToList();
            }
        }

        if (FechaDesdeHistorial != null && FechaHastaHistorial != null)
        {
            listadoDevoluciones = listadoDevoluciones.Where(l => l.Fecha_Hora >= FechaDesdeHistorial && l.Fecha_Hora <= FechaHastaHistorial).ToList();
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

    public JsonResult VerEncuesta(int DevolucionID)
    {
        List<VistaDevolucion> VistaDevolucion = new List<VistaDevolucion>();

        var devoluciones = _context.Devoluciones.Where(d => d.DevolucionID == DevolucionID).ToList();

        foreach (var devolucion in devoluciones)
        {
            var verEncuesta = new VistaDevolucion
            {
                DevolucionID = devolucion.DevolucionID,
                Encuesta = devolucion.Encuesta
            };
            VistaDevolucion.Add(verEncuesta);
        }
        return Json(VistaDevolucion);
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
        bool success = false;
        string resultado;

        if (!string.IsNullOrEmpty(Resenia) && !string.IsNullOrEmpty(Encuesta))
        {
            var nuevaDevolucion = new Devolucion
            {
                Fecha_Hora = DateTime.Now,
                Reseña = Resenia,
                UsuarioID = usuarioLogueadoID,
                Encuesta = Encuesta
            };

            _context.Devoluciones.Add(nuevaDevolucion);
            await _context.SaveChangesAsync();

            success = true;
            resultado = "<i class='fas fa-check-circle'></i> ¡La devolución se envió correctamente!";
        }
        else
        {
            resultado = "Debe cargar una observación.";
        }

        return Json(new { success = success, resultado = resultado });
    }

}