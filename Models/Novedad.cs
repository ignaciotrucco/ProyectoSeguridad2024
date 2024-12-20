using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class Novedad
{
    [Key]
    public int NovedadID { get; set; }
    public string? UsuarioID { get; set; }
    public int EmpresaID { get; set; }
    public int ArchivoID { get; set; }
    public DateTime Fecha_Hora { get; set; }
    public string? Observacion { get; set; }
}

public class VistaEmpleadoNovedad
{
    public int NovedadID { get; set; }
    public string? UsuarioID { get; set; }
    public int PersonaID { get; set; }
    public string? NombreEmpleado { get; set; }
    public List<VistaNovedad> VistaNovedad {get; set;}
    public List<VistaEmpresa> VistaEmpresa {get; set;}
}

public class VistaEmpresa {
    public int EmpresaID { get; set; }
    public string? EmpresaNombre { get; set; }
    public List<VistaNovedad> VistaNovedad {get; set;}
}

public class VistaNovedad
{
    public int NovedadID { get; set; }
    public string? UsuarioID { get; set; }
    public int ArchivoID { get; set; }
    public string? PersonaNombre { get; set; }
    public int EmpresaID { get; set; }
    public string? EmpresaNombre { get; set; }
    public DateTime Fecha_Hora { get; set; }
    public string? FechaHora { get; set; }
    public string? Observacion { get; set; }
    public string? ContentType { get; set; }
    public string? NombreArchivo { get; set; }
}