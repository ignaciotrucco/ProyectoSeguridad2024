using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Empresa
{
    [Key]
    public int EmpresaID { get; set;}
    public string? UsuarioID { get; set;}
    public int LocalidadID { get; set;}
    public string? RazonSocial { get; set;}
    public string? Domicilio { get; set;}
    public string? Cuit_Cdi { get; set;}
    public string? Telefono { get; set;}
    public string? Email { get; set;}
    public virtual Localidad Localidad {get; set;}
}

public class VistaEmpresas
{
    public int EmpresaID { get; set;}
    public string? RazonSocial { get; set;}
    public string? Cuit_Cdi { get; set;}
    public string? Telefono { get; set;}
    public string? Email { get; set;}
    public int LocalidadID { get; set;}
    public string? LocalidadNombre {get; set;}
    public int ProvinciaID {get; set;}
    public string? ProvinciaNombre {get; set;}
    public string? Domicilio { get; set;}
    public string? UsuarioID { get; set;}
    public string? EmailUsuario {get; set;}
}