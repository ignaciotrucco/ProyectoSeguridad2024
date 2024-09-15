using System.ComponentModel.DataAnnotations;

namespace ProyectoSeguridad2024.Models;

public class AsignacionJornada
{
    [Key]
    public int AsignacionJornadaID { get; set; }
    public int PersonaID { get; set; }
    public int JornadaLaboralID { get; set; }
}

public class VistaAsignacion {
    public int AsignacionJornadaID { get; set; }
    public int PersonaID { get; set; }
    public string? PersonaNombre {get; set;}
    public int JornadaLaboralID { get; set; }
    public string? InfoJornada {get; set;}
    public bool Dia { get; set; }
    public string? DiasSemana { get; set; }
    public DateTime DiaEspecial { get; set; }
    public string? DiaEspecialString { get; set; }
}