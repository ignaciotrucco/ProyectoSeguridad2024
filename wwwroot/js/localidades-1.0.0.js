window.onload = ListadoLocalidades();

function LimpiarModal() {
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("Nombre").value = "";
    document.getElementById("CP").value = "";
    document.getElementById("NombreError").innerHTML = "";
    document.getElementById("ProvinciaError").innerHTML = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Localidad")
}

function ListadoLocalidades() {

    $.ajax({
        // la URL para la petición
        url: '../../Localidades/ListadoLocalidades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (localidadesMostrar) {

            $("#modalLocalidades").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(localidadesMostrar, function (index, localidad) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${localidad.nombre}</td>
                    <td style="text-align: center">${localidad.codigoPostal}</td>
                    <td style="text-align: center">${localidad.provinciaNombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="ModalEditar(${localidad.localidadID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-localidad").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}

function GuardarLocalidad() {
    $("#NombreError").html("");
    $("#ProvinciaError").html("");

    let localidadID = $("#LocalidadID").val();
    let provinciaID = $("#ProvinciaID").val();
    let nombre = $("#Nombre").val().trim();
    let codigoPostal = $("#CP").val().trim();

    let registrado = true;

    if (nombre == "") {
        $("#NombreError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese un nombre de localidad.")
        registrado = false;
    }
    if (provinciaID == 0) {
        $("#ProvinciaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese una provincia.");
        registrado = false;
    }
    if (!codigoPostal) {
        codigoPostal = "No registrado"; // Texto por defecto si no ingresa codigo postal
    }

    if (registrado) {
        $.ajax({
            // la URL para la petición
            url: '../../Localidades/GuardarLocalidad',
            // la información a enviar
            // (también es posible utilizar una cadena de datos)
            data: { LocalidadID: localidadID, ProvinciaID: provinciaID, Nombre: nombre, CodigoPostal: codigoPostal },
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
                ListadoLocalidades();
            },

            // código a ejecutar si la petición falla;
            // son pasados como argumentos a la función
            // el objeto de la petición en crudo y código de estatus de la petición
            error: function (xhr, status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Disculpe, existió un problema al guardar la Localidad",
                });
            }
        });
    }
}

function ModalEditar(localidadID) {
    $.ajax({
        // la URL para la petición
        url: '../../Localidades/ListadoLocalidades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { LocalidadID: localidadID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (localidadesMostrar) {
            let listadoLocalidad = localidadesMostrar[0];

            document.getElementById("LocalidadID").value = localidadID;
            document.getElementById("ProvinciaID").value = listadoLocalidad.provinciaID;
            document.getElementById("Nombre").value = listadoLocalidad.nombre;
            document.getElementById("CP").value = listadoLocalidad.codigoPostal;
            $("#tituloModal").text("Editar Localidad")
            $("#modalLocalidades").modal("show");

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema",
            });
        }
    });
}

function EliminarLocalidad(localidadID) {
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
                url: '../../Localidades/EliminarLocalidad',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { LocalidadID: localidadID },
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

                    ListadoLocalidades()
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Disculpe, existió un problema al eliminar la Localidad",
                    });
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
