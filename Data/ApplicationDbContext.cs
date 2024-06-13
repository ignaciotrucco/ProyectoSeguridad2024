using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal2024.Models;
using ProyectoSeguridad2024.Models;

namespace ProyectoSeguridad2024.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<Archivo> Archivos {get; set;}
    public DbSet<Devolucion> Devoluciones {get; set;}
    public DbSet<Empresa> Empresas {get; set;}
    public DbSet<EnvioArchivo> EnvioArchivos {get; set;}
    public DbSet<EnvioMail> EnvioMails {get; set;}
    public DbSet<JornadaLaboral> JornadaLaboral {get; set;}
    public DbSet<Localidad> Localidades {get; set;}
    public DbSet<Novedad> Novedades {get; set;}
    public DbSet<Pais> Paises {get; set;}
    public DbSet<Persona> Personas {get; set;}
    public DbSet<Provincia> Provincias {get; set;}
    public DbSet<TipoDocumento> TipoDocumentos {get; set;}
    public DbSet<TurnoLaboral> TurnoLaboral {get; set;}
}
