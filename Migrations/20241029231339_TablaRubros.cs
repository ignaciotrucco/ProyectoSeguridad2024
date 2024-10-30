using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectoSeguridad2024.Migrations
{
    /// <inheritdoc />
    public partial class TablaRubros : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArchivoID",
                table: "Personas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RubroID",
                table: "Empresas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Rubros",
                columns: table => new
                {
                    RubroID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rubros", x => x.RubroID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_RubroID",
                table: "Empresas",
                column: "RubroID");

            migrationBuilder.AddForeignKey(
                name: "FK_Empresas_Rubros_RubroID",
                table: "Empresas",
                column: "RubroID",
                principalTable: "Rubros",
                principalColumn: "RubroID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empresas_Rubros_RubroID",
                table: "Empresas");

            migrationBuilder.DropTable(
                name: "Rubros");

            migrationBuilder.DropIndex(
                name: "IX_Empresas_RubroID",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "ArchivoID",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "RubroID",
                table: "Empresas");
        }
    }
}
