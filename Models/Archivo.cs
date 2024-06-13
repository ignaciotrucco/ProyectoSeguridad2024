using System.ComponentModel.DataAnnotations;

namespace ProyectoSeguridad2024.Models;

public class Archivo
{
    [Key]
    public int ArchivoID { get; set; }
    public byte[]? ArchivoBinario { get; set; }
    public string? ContentType { get; set; }
    public string? NombreArchivo { get; set; }
}