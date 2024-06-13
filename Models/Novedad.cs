using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Novedad
{
    [Key]
    public int NovedadID { get; set;}
    public string? UsuarioID { get; set;}
    public int EmpresaID { get; set;}
    public int ArchivoID {get; set;}
    public DateTime Fecha_Hora { get; set;}
    public string? Observacion { get; set;}
}