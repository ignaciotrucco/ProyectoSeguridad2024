using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class TurnoLaboral
{
    [Key]
    public int TurnoLaboralID { get; set;}
    public string? UsuarioID { get; set;}
    public int JornadaLaboralID { get; set;}
    public DateTime TurnoLaboralInicio { get; set;}
    public DateTime TurnoLaboralFin { get; set;}
    public string? Latitud { get; set;}
    public string? Longitud {get; set;}
    public bool Estado {get; set;}
}