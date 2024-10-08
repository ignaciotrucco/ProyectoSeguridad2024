using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Devolucion
{
    [Key]
    public int DevolucionID { get; set;}
    public string? UsuarioID { get; set;}
    public DateTime Fecha_Hora { get; set;}
    public string? Encuesta { get; set; }
    public string? Reseña { get; set;}
 }

 public class VistaClienteDevolucion {
    public int DevolucionID { get; set;}
    public string? UsuarioID { get; set;}
    public string? ClienteNombre {get; set;}
    public List<VistaDevolucion> VistaDevolucion {get; set;}
}

 public class VistaDevolucion {
    public int DevolucionID { get; set;}
    public string? UsuarioID { get; set;}
    public string? ClienteNombre {get; set;}
    public DateTime Fecha_Hora { get; set;}
    public string? FechaHora { get; set;}
    public string? Reseña { get; set;}
    public string? Encuesta { get; set; }
}