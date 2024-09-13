using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class TurnoLaboral
{
    [Key]
    public int TurnoLaboralID { get; set;}
    public string? UsuarioID { get; set;}
    public int JornadaLaboralID { get; set;}
    public DateTime FechaFichaje { get; set;}
    public Momento Momento { get; set;}
    public string? Latitud { get; set;}
    public string? Longitud {get; set;}
    public bool Estado {get; set;}
}

public enum Momento {
    Entrada = 1,
    Salida
}


//UN SOLO CAMPO DE FECHA Y AGREGAR ENUMERABLE ENTRADA O SALIDA