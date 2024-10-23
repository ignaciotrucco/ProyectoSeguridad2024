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

public class VistaTurno {
    public int TurnoLaboralID { get; set;}
    public string? UsuarioID { get; set;}
    public int PersonaID {get; set;}
    public string? NombreEmpleado {get; set;}
    public int JornadaLaboralID { get; set;}
    public string? Jornada {get; set;}
    public List<VistaTurnosLaborales> VistaTurnosLaborales {get; set;}
}

public class VistaTurnosLaborales {
    public int TurnoLaboralID { get; set;}
    public string? UsuarioID { get; set;}
    public string? NombreEmpleado {get; set;}
    public int JornadaLaboralID { get; set;}
    public string? Jornada {get; set;}
    public DateTime FechaFichaje { get; set;}
    public string? FechaFichajeString {get; set;}
    public Momento Momento { get; set;}
    public string? MomentoString {get; set;}
    public string? Latitud { get; set;}
    public string? Longitud {get; set;}
    public bool Estado {get; set;}
}


//UN SOLO CAMPO DE FECHA Y AGREGAR ENUMERABLE ENTRADA O SALIDA