using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class JornadaLaboral
{
    [Key]
    public int JornadaLaboralID { get; set;}
    public int EmpresaID { get; set;}
    public DateTime HorarioEntrada { get; set;}
    public DateTime HorarioSalida { get; set;}
}