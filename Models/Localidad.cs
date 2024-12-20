using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Localidad
{
    [Key]
    public int LocalidadID { get; set;}
    public int ProvinciaID { get; set;}
    public string? Nombre { get; set;}
    public string? CodigoPostal { get; set;}
    public virtual Provincia Provincia {get; set;}
    public virtual ICollection<Persona> Personas {get; set;}
    public virtual ICollection<Empresa> Empresas {get; set;}
}

public class VistaLocalidades 
{
    public int LocalidadID { get; set;}
    public int ProvinciaID { get; set;}
    public string? ProvinciaNombre {get; set;}
    public string? Nombre { get; set;}
    public string? CodigoPostal { get; set;}
}

public class VistaEmpresasPorLocalidad
{
    public int LocalidadID { get; set; }
    public string NombreLocalidad { get; set; }
    public int CantidadEmpresas { get; set; }
}
