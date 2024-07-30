using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectoSeguridad2024.Models;
using Microsoft.AspNetCore.Authorization;
using ProyectoSeguridad2024.Data;
using ProyectoFinal2024.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ProyectoSeguridad2024.Controllers;

[Authorize]

public class EmpresasController : Controller
{
    private ApplicationDbContext _context;

    public EmpresasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Empresas()
    {

        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE UNA PROVINCIA...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(t => t.Nombre), "ProvinciaID", "Nombre");

        var localidades = _context.Localidades.ToList();
        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE UNA LOCALIDAD...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(t => t.Nombre), "LocalidadID", "Nombre");

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

    public JsonResult ListadoEmpresas(int? EmpresaID)
    {

        var listadoEmpresas = _context.Empresas.Include(l => l.Localidad).Include(p => p.Localidad.Provincia).ToList();

        if (EmpresaID != null)
        {
            listadoEmpresas = _context.Empresas.Where(l => l.EmpresaID == EmpresaID).ToList();
        }

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
            UsuarioID = l.UsuarioID
        }).ToList();

        return Json(mostrarEmpresa);
    }

    public JsonResult GuardarEmpresas (int EmpresaID, int LocalidadID, string UsuarioID, string RazonSocial, string Cuit_Cdi, string Telefono, string Email, string Domicilio)
    {
        string resultado = "";

        RazonSocial = RazonSocial.ToUpper();
        Domicilio = Domicilio.ToUpper();

        if (EmpresaID == 0)
        {
            var existeEmpresa = _context.Empresas.Where(e => e.RazonSocial == RazonSocial).Count();
            if (existeEmpresa == 0)
            {
                var nuevaEmpresa = new Empresa {
                    EmpresaID = EmpresaID,
                    LocalidadID = LocalidadID,
                    UsuarioID = UsuarioID,
                    RazonSocial = RazonSocial,
                    Cuit_Cdi = Cuit_Cdi,
                    Telefono = Telefono,
                    Email = Email,
                    Domicilio = Domicilio
                };
                _context.Add(nuevaEmpresa);
                _context.SaveChanges();
                resultado = "¡Empresa agregada correctamente!";
            }
            else 
            {
                resultado = "Empresa existente";
            }
        }
        else
        {
            var editarEmpresa = _context.Empresas.Where(e => e.EmpresaID == EmpresaID).SingleOrDefault();
            if (editarEmpresa != null)
            {
                var existeEmpresaEditar = _context.Empresas.Where(e => e.RazonSocial == RazonSocial && e.EmpresaID != EmpresaID).Count();
                if (existeEmpresaEditar == 0)
                {
                    editarEmpresa.LocalidadID = LocalidadID;
                    editarEmpresa.UsuarioID = UsuarioID;
                    editarEmpresa.RazonSocial = RazonSocial;
                    editarEmpresa.Cuit_Cdi = Cuit_Cdi;
                    editarEmpresa.Telefono = Telefono;
                    editarEmpresa.Email = Email;
                    editarEmpresa.Domicilio = Domicilio;
                    _context.SaveChanges();
                    resultado = "¡Empresa editada correctamente!";
                }
                else
                {
                    resultado = "La empresa que ingresó ya existe";
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