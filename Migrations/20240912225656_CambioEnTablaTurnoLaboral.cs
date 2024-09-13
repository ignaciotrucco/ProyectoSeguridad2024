using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoSeguridad2024.Migrations
{
    /// <inheritdoc />
    public partial class CambioEnTablaTurnoLaboral : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TurnoLaboralFin",
                table: "TurnoLaboral");

            migrationBuilder.RenameColumn(
                name: "TurnoLaboralInicio",
                table: "TurnoLaboral",
                newName: "FechaFichaje");

            migrationBuilder.AddColumn<int>(
                name: "Momento",
                table: "TurnoLaboral",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Momento",
                table: "TurnoLaboral");

            migrationBuilder.RenameColumn(
                name: "FechaFichaje",
                table: "TurnoLaboral",
                newName: "TurnoLaboralInicio");

            migrationBuilder.AddColumn<DateTime>(
                name: "TurnoLaboralFin",
                table: "TurnoLaboral",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
