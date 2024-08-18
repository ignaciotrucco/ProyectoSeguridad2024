window.onload = ListadoProvincias();

function LimpiarModal() {
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("NombreProvincia").value = "";
    document.getElementById("NombreError").innerHTML = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Provincia")
}

let filasPorPagina = 7;
let paginaActual = 1;
let totalProvincias = 0;

function ListadoProvincias(pagina = 1) {
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        type: 'POST',
        dataType: 'json',
        success: function (listadoProvincias) {
            $("#modalProvincias").modal("hide");
            LimpiarModal()

            totalProvincias = listadoProvincias.length; // Obtiene el total de provincias
            const inicio = (pagina - 1) * filasPorPagina;
            const fin = inicio + filasPorPagina;
            const provinciasPaginadas = listadoProvincias.slice(inicio, fin);

            let contenidoTabla = ``;
            $.each(provinciasPaginadas, function (index, provincia) {
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
            renderizarControlesDePaginacion();
        },
        error: function (xhr, status) {
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

function renderizarControlesDePaginacion() {
    const totalPaginas = Math.ceil(totalProvincias / filasPorPagina);
    let controlesPaginacion = ``;

    for (let i = 1; i <= totalPaginas; i++) {
        const claseActiva = i === paginaActual ? 'active' : '';
        controlesPaginacion += `<li class="page-item ${claseActiva}">
            <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
        </li>`;
    }

    document.getElementById("pagination-controls").innerHTML = controlesPaginacion;
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    ListadoProvincias(paginaActual);
}

// Llamar la función inicial para cargar la primera página
ListadoProvincias(paginaActual);


function GuardarRegistros() {
    $("#NombreError").html("");

    let provinciaID = $("#ProvinciaID").val();
    let nombre = $("#NombreProvincia").val().trim();

    console.log(provinciaID + " - " + nombre)

    let guardado = true;

    if (nombre == "") {
        $("#NombreError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese un nombre de provincia.")
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
                Swal.fire({
                    position: "bottom-end",
                    icon: "error",
                    title: "Oops...",
                    text: "Disculpe, existió un problema al guardar la provincia",
                    timer: 2000,
                    timerProgressBar: true
                });;
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
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
                timer: 2000,
                timerProgressBar: true
            });
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
                            position: "bottom-end",
                            icon: "error",
                            title: "Oops...",
                            text: "No se puede eliminar, existen registros asociados",
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }
                    ListadoProvincias();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    Swal.fire({
                        position: "bottom-end",
                        icon: "error",
                        title: "Oops...",
                        text: "Disculpe, existió un problema al eliminar la provincia",
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        backdrop: false
                    });
                }
            });

            swalWithBootstrapButtons.fire({
                position: "bottom-end",
                title: "¡Borrado!",
                text: "Su registro ha sido eliminado.",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                backdrop: false
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                position: "bottom-end",
                title: "Anulado",
                text: "Tu registro está a salvo :)",
                icon: "error",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                backdrop: false
            });
        }
    });

}