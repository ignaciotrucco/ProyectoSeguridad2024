window.onload = ListadoProvincias();

function LimpiarModal() {
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("NombreProvincia").value = "";
    document.getElementById("NombreError").innerHTML = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Provincia")
}

function ListadoProvincias() {

    $.ajax({
        // la URL para la petición
        url: '../../Provincias/ListadoProvincias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoProvincias) {

            $("#modalProvincias").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(listadoProvincias, function (index, provincia) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${provincia.nombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="ModalEditar(${provincia.provinciaID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarProvincia(${provincia.provinciaID})">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-provincias").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function GuardarRegistros() {
    $("#NombreError").html("");

    let provinciaID = $("#ProvinciaID").val();
    let nombre = $("#NombreProvincia").val().trim();

    console.log(provinciaID + " - " + nombre)

    let guardado = true;

    if (nombre == "") {
        $("#NombreError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Debe ingresar un nombre de provincia!")
        guardado = false;
    }

    if (guardado) {
        $.ajax({
            // la URL para la petición
            url: '../../Provincias/GuardarRegistros',
            // la información a enviar
            // (también es posible utilizar una cadena de datos)
            data: { ProvinciaID: provinciaID, Nombre: nombre },
            // especifica si será una petición POST o GET
            type: 'POST',
            // el tipo de información que se espera de respuesta
            dataType: 'json',
            // código a ejecutar si la petición es satisfactoria;
            // la respuesta es pasada como argumento a la función
            success: function (resultado) {

                if (resultado != "") {
                    Swal.fire(resultado);
                }
                ListadoProvincias();
            },

            // código a ejecutar si la petición falla;
            // son pasados como argumentos a la función
            // el objeto de la petición en crudo y código de estatus de la petición
            error: function (xhr, status) {
                console.log('Disculpe, existió un problema al cargar el listado');
            }
        });
    }
}

function ModalEditar(provinciaID) {
    $.ajax({
        // la URL para la petición
        url: '../../Provincias/ListadoProvincias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { ProvinciaID: provinciaID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoProvincias) {
            let listadoProvincia = listadoProvincias[0];

            document.getElementById("ProvinciaID").value = provinciaID;
            document.getElementById("NombreProvincia").value = listadoProvincia.nombre;
            $("#tituloModal").text("Editar Provincia")
            $("#modalProvincias").modal("show");

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function EliminarProvincia(provinciaID) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-success"
        },
        buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                // la URL para la petición
                url: '../../Provincias/EliminarRegistros',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { ProvinciaID: provinciaID },
                // especifica si será una petición POST o GET
                type: 'POST',
                // el tipo de información que se espera de respuesta
                dataType: 'json',
                // código a ejecutar si la petición es satisfactoria;
                // la respuesta es pasada como argumento a la función
                success: function (resultado) {
                    if (!resultado) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se puede eliminar, existen registros asociados",
                        });
                    }
                    ListadoProvincias();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al cargar el listado');
                }
            });

            swalWithBootstrapButtons.fire({
                title: "¡Borrado!",
                text: "Su registro ha sido eliminado.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Anulado",
                text: "Tu registro está a salvo :)",
                icon: "error"
            });
        }
    });

}