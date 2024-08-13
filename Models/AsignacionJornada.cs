using System.ComponentModel.DataAnnotations;

namespace ProyectoSeguridad2024.Models;

public class AsignacionJornada
{
    [Key]
    public int AsignacionJornadaID { get; set; }
    public int PersonaID { get; set; }
    public int JornadaLaboralID { get; set; }
}