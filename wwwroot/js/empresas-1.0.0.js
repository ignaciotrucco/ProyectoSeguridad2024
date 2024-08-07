window.onload = ListadoEmpresas();

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Empresa")
}

function LimpiarModal() {
    $("#EmpresaID").val(0);
    $("#RazonSocial").val("");
    $("#Cuit").val("");
    $("#telefono").val("");
    $("#email").val("");
    $("#ProvinciaID").val(0);
    $("#LocalidadID").val(0);
    $("#domicilio").val("");
    $("#UsuarioID").val("");
    $("#razonSocialError").html("");
    $("#cuitError").html("");
    $("#telefonoEmpresaError").html("");
    $("#emailEmpresaError").html("");
    $("#domicilioEmpresaError").html("");
    $("#localidadEmpresaError").html("");
    $("#provinciaEmpresaError").html("");
}

$('#ProvinciaID').change(function () {
    var provinciaId = $(this).val();
    if (provinciaId) {
        $.ajax({
            url: '../../Personas/GetLocalidades',
            type: 'GET',
            data: { provinciaId: provinciaId },
            success: function (data) {
                var localidadDropdown = $('#LocalidadID');
                localidadDropdown.empty();
                localidadDropdown.append('<option value="">Seleccione una localidad</option>');
                $.each(data, function (index, item) {
                    localidadDropdown.append('<option value="' + item.localidadID + '">' + item.nombre + '</option>');
                });
            }
        });
    } else {
        $('#LocalidadID').empty();
        $('#LocalidadID').append('<option value="">Seleccione una localidad</option>');
    }
});

function ListadoEmpresas() {
    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (mostrarEmpresa) {

            $("#modalEmpresas").modal("hide");
            LimpiarModal();

            let contenidoTabla = ``;

            $.each(mostrarEmpresa, function (index, empresa) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${empresa.razonSocial}</td>
                    <td style="text-align: center">${empresa.cuit_Cdi}</td>
                    <td style="text-align: center">${empresa.telefono}</td>
                    <td style="text-align: center">${empresa.email}</td>
                    <td style="text-align: center">${empresa.provinciaNombre}</td>
                    <td style="text-align: center">${empresa.localidadNombre}</td>
                    <td style="text-align: center">${empresa.domicilio}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="AbrirModalEditar(${empresa.empresaID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarEmpresa(${empresa.empresaID})">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-empresas").innerHTML = contenidoTabla;

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

function GuardarEmpresa() {

    let empresaID = $("#EmpresaID").val();
    let razonSocial = $("#RazonSocial").val().trim();
    let cuit = $("#Cuit").val().trim();
    let telefono = $("#telefono").val().trim();
    let email = $("#email").val().trim();
    let localidadID = $("#LocalidadID").val();
    let domicilio = $("#domicilio").val();
    let usuarioID = $("#UsuarioID").val();

    let registrado = true;

    if (razonSocial == "") {
        $("#razonSocialError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La razon social de la empresa es requerida.")
        registrado = false;
    }

    if (cuit == "") {
        $("#cuitError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El CUIT de la empresa es requerido.")
        registrado = false;
    }

    if (telefono == "") {
        $("#telefonoEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El teléfono de la empresa es requerido.")
        registrado = false;
    }

    if (email == "") {
        $("#emailEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El email de contacto es requerido.")
        registrado = false;
    }

    if (domicilio == "") {
        $("#domicilioEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El domicilio de la empresa es requerido.")
        registrado = false;
    }

    if (localidadID == 0) {
        $("#localidadEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La localidad es requerida.")
        registrado = false;
    }

    if (localidadID == 0) {
        $("#provinciaEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La provincia es requerida.")
        registrado = false;
    }

    if (registrado) {

        $.ajax({
            url: '../../Empresas/GuardarEmpresas',
            data: {
                EmpresaID: empresaID,
                LocalidadID: localidadID,
                UsuarioID: usuarioID,
                RazonSocial: razonSocial,
                Cuit_Cdi: cuit,
                Telefono: telefono,
                Email: email,
                Domicilio: domicilio
            },
            type: 'POST',
            dataType: 'json',
            success: function (resultado) {
                
                if (resultado != "") {
                    Swal.fire(resultado);
                }
                ListadoEmpresas();
    
            },
            error: function (xhr, status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Disculpe, existió un problema al guardar la empresa",
                });
            }
        });

    }

}

function AbrirModalEditar(empresaID) {
    console.log(empresaID);
    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {EmpresaID: empresaID},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (mostrarEmpresa) {
            let mostrarEmpresas = mostrarEmpresa[0];
            
            $("#EmpresaID").val(empresaID);
            $("#RazonSocial").val(mostrarEmpresas.razonSocial);
            $("#Cuit").val(mostrarEmpresas.cuit_Cdi);
            $("#telefono").val(mostrarEmpresas.telefono);
            $("#email").val(mostrarEmpresas.email);
            $("#ProvinciaID").val(mostrarEmpresas.provinciaID);
            $("#LocalidadID").val(mostrarEmpresas.localidadID);
            $("#domicilio").val(mostrarEmpresas.domicilio);
            $("#UsuarioID").val(mostrarEmpresas.usuarioID);
            $("#modalEmpresas").modal("show");
            $("#tituloModal").text("Editar Empresa");
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

function EliminarEmpresa(empresaID) {
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
                url: '../../Empresas/EliminarEmpresa',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { EmpresaID: empresaID },
                // especifica si será una petición POST o GET
                type: 'POST',
                // el tipo de información que se espera de respuesta
                dataType: 'json',
                // código a ejecutar si la petición es satisfactoria;
                // la respuesta es pasada como argumento a la función
                success: function (eliminarEmpresa) {

                    // if (!resultado) {
                    //     Swal.fire({
                    //         icon: "error",
                    //         title: "Oops...",
                    //         text: "No se puede eliminar, existen registros asociados",
                    //     });
                    // }

                    ListadoEmpresas();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Disculpe, existió un problema al eliminar la empresa",
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

function openModalTel() {
    var modal = document.getElementById("ModalTelefono");
    modal.style.display = "block";
}

function closeModalTel() {
    var modal = document.getElementById("ModalTelefono");
    modal.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModalTel();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalTelefono");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openModalCuit() {
    var modal = document.getElementById("ModalCuit");
    modal.style.display = "block";
}

function closeModalCuit() {
    var modal = document.getElementById("ModalCuit");
    modal.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModalCuit();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalCuit");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$(document).ready(function(){
    $('#Cuit').mask('00-00000000-0');
    $('#telefono').mask('(00) 0000-000000');
});