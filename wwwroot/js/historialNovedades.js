window.onload = HistorialNovedades();

function HistorialNovedades() {

    let personaID = $("#PersonaID").val();
    let fechaDesde = $("#fechaDesdeHistorial").val();
    let fechaHasta = $("#fechaHastaHistorial").val();

    $.ajax({
        // la URL para la petición
        url: '../../NovedadesEmpleado/ListadoHistorialNovedades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {
            PersonaID: personaID,
            FechaDesde: fechaDesde,
            FechaHasta: fechaHasta,
        },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaEmpleadoNovedad) {



            let contenidoTabla = ``;

            $.each(VistaEmpleadoNovedad, function (index, empleado) {


                contenidoTabla += `
                    <tr>
                        <td style="text-align: center"><b>${empleado.nombreEmpleado}</b></td>
                        <td style="text-align: center"></td>
                        <td style="text-align: center"></td>
                        <td style="text-align: center"></td>
                    </tr>
                `;

                $.each(empleado.vistaEmpresa, function (index, empresa) {


                    contenidoTabla += `
                        <tr>
                            <td style="text-align: center"><b></b></td>
                            <td style="text-align: center">${empresa.empresaNombre}</td>
                            <td style="text-align: center"></td>
                            <td style="text-align: center"></td>
                        </tr>
                    `;

                    $.each(empresa.vistaNovedad, function (index, novedad) {

                        if (novedad.nombreArchivo) {
                            contenidoTabla += `
                        <tr>
                            <td style="text-align: center"></td>
                            <td style="text-align: center"></td>
                            <td style="text-align: center">${novedad.fechaHora}</td>
                            <td style="text-align: center">${novedad.observacion}</td>
                            <td style="text-align: center">
                                <img title="Expandir" src="data:${novedad.contentType};base64,${novedad.nombreArchivo}" 
                                style="width: 230px; height: 180px; cursor: pointer; justify-content:center !important; box-shadow: 2px 2px 2px grey"" 
                                onclick="mostrarImagenGrande(this.src)" id="miImagen" />
                            </td>
                        </tr>
                    `;
                        }
                        else {
                            contenidoTabla += `
                        <tr class="bg-danger p-2" style="--bs-bg-opacity: .5;">
                            <td style="text-align: center"></td>
                            <td style="text-align: center"></td>
                            <td style="text-align: center">${novedad.fechaHora}</td>
                            <td style="text-align: center">${novedad.observacion}</td>
                            <td style="text-align: center">
                                <p>Sin evidencia.</p>
                            </td>
                        </tr>
                    `;
                        }




                    });
                });
            });


            document.getElementById("tbody-historialDevoluciones").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#ffe7e7',
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al carga el listado",
            });
        }
    });
}

function LimpiarFiltros() {
    $("#PersonaID").val(0);
    $("#fechaDesdeHistorial").val("");
    $("#fechaHastaHistorial").val("");
    HistorialNovedades();
}