using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Pais
{
    [Key]
    public int PaisID { get; set;}
    public string? Nombre { get; set;}
    public virtual ICollection<Provincia> Provincias {get; set;}
}