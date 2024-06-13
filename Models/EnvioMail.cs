using System.ComponentModel.DataAnnotations;

namespace ProyectoFinal2024.Models;

public class EnvioMail
{
    [Key]
    public int EnvioMailID { get; set;}
    public int PersonaEmisorID { get; set;} 
    public int PersonaReceptorID {get; set;}
    public int ArchivoID {get; set;}
}