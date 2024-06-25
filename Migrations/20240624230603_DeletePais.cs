using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoSeguridad2024.Migrations
{
    /// <inheritdoc />
    public partial class DeletePais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaisID",
                table: "Provincias");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaisID",
                table: "Provincias",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
