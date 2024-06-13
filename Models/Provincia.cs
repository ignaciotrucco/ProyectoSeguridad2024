using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Provincia
{
    [Key]
    public int ProvinciaID { get; set;}
    public int PaisID { get; set;}
    public string? Nombre { get; set;}
    public virtual Pais Pais {get; set;}
    public virtual ICollection<Localidad> Localidades {get; set;}
}