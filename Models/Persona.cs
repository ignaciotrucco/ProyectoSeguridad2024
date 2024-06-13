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
    public string? Nombre { get; set;}
    public string? Apellido { get; set;}
    public string? Telefono { get; set;}
    public string? Domicilio { get; set;}
    public string? Email { get; set;}
    public virtual Localidad Localidad {get; set;}
    public virtual TipoDocumento TipoDocumentos {get; set;}
}
