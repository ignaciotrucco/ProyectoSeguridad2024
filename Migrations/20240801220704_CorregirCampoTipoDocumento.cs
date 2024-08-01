using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoSeguridad2024.Migrations
{
    /// <inheritdoc />
    public partial class CorregirCampoTipoDocumento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Personas_TipoDocumentoID",
                table: "Personas");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_TipoDocumentoID",
                table: "Personas",
                column: "TipoDocumentoID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Personas_TipoDocumentoID",
                table: "Personas");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_TipoDocumentoID",
                table: "Personas",
                column: "TipoDocumentoID",
                unique: true);
        }
    }
}
