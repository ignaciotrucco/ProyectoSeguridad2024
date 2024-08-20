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

public class EmpresasController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public EmpresasController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public IActionResult Empresas()
    {

        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        var localidades = _context.Localidades.ToList();
        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE UNA LOCALIDAD...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(t => t.Nombre), "LocalidadID", "Nombre");

        var usuarios = _context.Users.ToList();
        ViewBag.UsuarioID = new SelectList(usuarios.OrderBy(t => t.Email), "Email", "Email");

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

    public JsonResult ListadoEmpresas(int? EmpresaID, string busqueda)
    {
        // LISTADO COMPLETO DE EMPRESAS CON SUS RELACIONES
        var listadoEmpresas = _context.Empresas.Include(l => l.Localidad).Include(p => p.Localidad.Provincia).AsQueryable();

        // FILTRAR POR ID DE EMPRESA
        if (EmpresaID != null)
        {
            listadoEmpresas = _context.Empresas.Where(l => l.EmpresaID == EmpresaID);
        }

        // FILTRAR POR CUALQUIER CAMPO SI SE PROPORCIONA UN TERMMINO DE BUSQUEDA
        if (!string.IsNullOrEmpty(busqueda))
        {

            listadoEmpresas = listadoEmpresas.Where(p =>
                p.RazonSocial.Contains(busqueda) ||
                p.Cuit_Cdi.Contains(busqueda) ||
                p.Telefono.Contains(busqueda) ||
                p.Email.Contains(busqueda) ||
                p.Localidad.Nombre.Contains(busqueda) ||
                p.Localidad.Provincia.Nombre.Contains(busqueda) ||
                p.Domicilio.Contains(busqueda)
            );
        };

        var mostrarEmpresa = listadoEmpresas
        .Select(l => new VistaEmpresas
        {
            EmpresaID = l.EmpresaID,
            RazonSocial = l.RazonSocial,
            Cuit_Cdi = l.Cuit_Cdi,
            Telefono = l.Telefono,
            Email = l.Email,
            LocalidadID = l.LocalidadID,
            LocalidadNombre = l.Localidad.Nombre,
            ProvinciaID = l.Localidad.ProvinciaID,
            ProvinciaNombre = l.Localidad.Provincia.Nombre,
            Domicilio = l.Domicilio,
            UsuarioID = l.UsuarioID,
            EmailUsuario = _context.Users.Where(u => u.Id == l.UsuarioID).Select(u => u.Email).FirstOrDefault()
        }).ToList();

        return Json(mostrarEmpresa);
    }

    public JsonResult GuardarEmpresas(int EmpresaID, int LocalidadID, string UsuarioID, string RazonSocial, string Cuit_Cdi, string Telefono, string Email, string Domicilio)
    {

        var usuario = _userManager.FindByEmailAsync(UsuarioID).Result;

        var UsuarioIDconvertido = usuario.Id;

        string resultado = "";

        RazonSocial = RazonSocial.ToUpper();
        Domicilio = Domicilio.ToUpper();

        if (EmpresaID == 0)
        {
            var existeEmpresa = _context.Empresas.Where(e => e.RazonSocial == RazonSocial).Count();
            if (existeEmpresa == 0)
            {
                var nuevaEmpresa = new Empresa
                {
                    EmpresaID = EmpresaID,
                    LocalidadID = LocalidadID,
                    UsuarioID = UsuarioIDconvertido,
                    RazonSocial = RazonSocial,
                    Cuit_Cdi = Cuit_Cdi,
                    Telefono = Telefono,
                    Email = Email,
                    Domicilio = Domicilio
                };
                _context.Add(nuevaEmpresa);
                _context.SaveChanges();
                resultado = "<i class='fas fa-check-circle'></i> ¡Empresa agregada correctamente!";
            }
            else
            {
                resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Empresa existente!";
            }
        }
        else
        {
            var editarEmpresa = _context.Empresas.Where(e => e.EmpresaID == EmpresaID).SingleOrDefault();
            if (editarEmpresa != null)
            {
                var existeEmpresaEditar = _context.Empresas.Where(e => e.Cuit_Cdi == Cuit_Cdi && e.EmpresaID != EmpresaID).Count();
                if (existeEmpresaEditar == 0)
                {
                    editarEmpresa.LocalidadID = LocalidadID;
                    editarEmpresa.UsuarioID = UsuarioIDconvertido;
                    editarEmpresa.RazonSocial = RazonSocial;
                    editarEmpresa.Cuit_Cdi = Cuit_Cdi;
                    editarEmpresa.Telefono = Telefono;
                    editarEmpresa.Email = Email;
                    editarEmpresa.Domicilio = Domicilio;
                    _context.SaveChanges();
                    resultado = "<i class='fas fa-check-circle'></i> ¡Empresa editada correctamente!";
                }
                else
                {
                    resultado = "<i class='fas fa-exclamation-triangle'></i> ¡Empresa existente!";
                }
            }
        }

        return Json(resultado);
    }

    public JsonResult EliminarEmpresa(int EmpresaID)
    {
        var eliminarEmpresa = _context.Empresas.Find(EmpresaID);
        _context.Remove(eliminarEmpresa);
        _context.SaveChanges();


        return Json(eliminarEmpresa);
    }
}