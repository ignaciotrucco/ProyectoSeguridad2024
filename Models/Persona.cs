using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ProyectoFinal2024.Models;

public class Persona
{
    [Key]
    public int PersonaID { get; set;}
    public int LocalidadID { get; set;}
    public int TipoDocumentoID { get; set;}
    public string? UsuarioID {get; set;}
    public int ArchivoID { get; set; }
    public string? NombreCompleto { get; set;}
    public DateTime FechaNacimiento {get; set;}
    public string? Telefono { get; set;}
    public string? Domicilio { get; set;}
    public string? Email { get; set;}
    public int NumeroDocumento {get; set;}
    public virtual Localidad Localidad {get; set;}
    public virtual TipoDocumento TipoDocumentos {get; set;}
}

public class VistaUsuarios 
{
    public string? UsuarioID {get ;set; }
    public string? Email {get ;set; }
    public string? RolNombre {get ;set; }
}

public class VistaPersonas
{
    public int PersonaID { get; set;}
    public int LocalidadID { get; set;}
    public string? LocalidadNombre {get; set;}
    public int ProvinciaID {get; set;}
    public string? ProvinciaNombre {get; set;}
    public int TipoDocumentoID { get; set;}
    public string? TipoDocumentoNombre {get; set;}
    public string? UsuarioID {get; set;}
    public string? EmailUsuario {get; set;}
    public string? NombreCompleto { get; set;}
    public DateTime FechaNacimiento {get; set;}
    public string? FechaNacimientoString {get; set;}
    public string? Telefono { get; set;}
    public string? Domicilio { get; set;}
    public string? Email { get; set;}
    public int NumeroDocumento {get; set;}
    public string? RolPersona {get; set;}
    public int ArchivoID {get; set;}
    public string? ContentType { get; set; }
    public string? NombreArchivo { get; set; }
}
