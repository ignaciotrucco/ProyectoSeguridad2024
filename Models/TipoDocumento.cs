using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class TipoDocumento
{
    [Key]
    public int TipoDocumentoID { get; set;}
    public string? Nombre { get; set;}
    public virtual ICollection<Persona> Personas {get; set;}
}