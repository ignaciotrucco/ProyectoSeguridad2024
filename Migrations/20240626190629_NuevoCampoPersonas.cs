using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoSeguridad2024.Migrations
{
    /// <inheritdoc />
    public partial class NuevoCampoPersonas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumeroDocumento",
                table: "Personas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroDocumento",
                table: "Personas");
        }
    }
}
