using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProyectoFinal2024.Models;

public class JornadaLaboral
{
    [Key]
    public int JornadaLaboralID { get; set; }
    public string? Lugar { get; set; }
    public bool Dia { get; set; }
    public DateTime DiaEspecial { get; set; }
    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }
    public int EmpresaID { get; set; }
    public DateTime HorarioEntrada { get; set; }
    public DateTime HorarioSalida { get; set; }

    [NotMapped]
    public string? InfoJornada
    {
        get
        {
            if (JornadaLaboralID > 0)
            {
                return Lugar + " (" + HorarioEntrada.ToString("HH:mm") + " - " + HorarioSalida.ToString("HH:mm") + ")";
            }
            else {
                return Lugar;
            }
        }
    }
}

public class VistaJornadaLaboral
{
    public int JornadaLaboralID { get; set; }
    public string? Lugar { get; set; }
    public bool Dia { get; set; }
    public DateTime DiaEspecial { get; set; }
    public string? DiaEspecialString { get; set; }
    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }
    public string? DiasSemana { get; set; }
    public int EmpresaID { get; set; }
    public string? NombreEmpresa { get; set; }
    public DateTime HorarioEntrada { get; set; }
    public string? HorarioEntradaString { get; set; }
    public DateTime HorarioSalida { get; set; }
    public string? HorarioSalidaString { get; set; }
}