using System.ComponentModel.DataAnnotations;
using ProyectoFinal2024.Models;

namespace ProyectoSeguridad2024.Models;

public class Rubro
{
    [Key]
    public int RubroID { get; set; }
    public string? Nombre { get; set; }
    public virtual ICollection<Empresa> Empresas {get; set;}
}