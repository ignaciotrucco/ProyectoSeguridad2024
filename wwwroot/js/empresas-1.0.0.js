window.onload = ListadoEmpresas();

function NuevoRegistro() {
    $("#tituloModal").text("Nuevo Cliente")
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
    $("#RubroID").val(0);
    $("#razonSocialError").html("");
    $("#cuitError").html("");
    $("#telefonoEmpresaError").html("");
    $("#emailEmpresaError").html("");
    $("#domicilioEmpresaError").html("");
    $("#localidadEmpresaError").html("");
    $("#provinciaEmpresaError").html("");
    $("#usuarioEmpresaError").html("");
    $("#rubroError").html("");
}

$('#ProvinciaID').change(function () {
    BuscarLocalidades()
});

function BuscarLocalidades() {
    $("#LocalidadID").empty();

    var provinciaId = $("#ProvinciaID").val();

    $.ajax({
        async: false,
        type: 'POST',
        url: '../../Personas/GetLocalidades',
        datatype: 'json',
        data: { provinciaId: provinciaId },
        success: function (localidades) {

            if (provinciaId == 0) {
                $("#LocalidadID").append('<option value="' + "0" + '">' + "[SELECCIONE UNA LOCALIDAD]" + '</option>');
            }
            else {
                if (localidades.length == 0) {
                    $("#LocalidadID").append('<option value="' + "0" + '">' + "[NO EXISTEN LOCALIDADES]" + '</option>');
                }
                else {
                    $.each(localidades, function (i, localidad) {
                        $("#LocalidadID").append('<option value="' + localidad.localidadID + '">' + localidad.nombre + '</option>');
                    });
                }
            }
        },
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}

// ESCUCHA EL EVENTO 'KEYUP' EN EL CAMPO DE BÚSQUEDA CON ID 'INPUTBUSQUEDA'
// CADA VEZ QUE EL USUARIO ESCRIBE, SE CAPTURA EL VALOR ACTUAL Y SE LLAMA A LA FUNCIÓN LISTADOPERSONAS
// PARA FILTRAR LA LISTA DE PERSONAS SEGÚN EL TEXTO INGRESADO.
$(document).ready(function () {
    $('#inputBusqueda').on('keyup', function () {
        let busqueda = $(this).val();
        ListadoEmpresas(busqueda);
    });
});

function ListadoEmpresas(busqueda) {
    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { busqueda: busqueda }, // PASA EL TERMINO DE BUSQUEDA AL CONTROLADOR
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
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.rubroNombre}</td>
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.cuit_Cdi}</td>
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.telefono}</td>
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.email}</td>
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.provinciaNombre}</td>
                    <td style="text-align: center" class="ocultar-en-767px">${empresa.localidadNombre}</td>
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
                    <td style="text-align: left">
                    <button type="button" class="btn mostrar-en-767px" title="Detalles" onclick="mostrarModal('${empresa.razonSocial}',
                     '${empresa.rubroNombre}','${empresa.cuit_Cdi}', '${empresa.telefono}', '${empresa.email}', '${empresa.provinciaNombre}', '${empresa.localidadNombre}',
                      '${empresa.domicilio}')">
                    <i class="fa-solid fa-info" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-empresas").innerHTML = contenidoTabla;

            TablaImprimir();
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}

function TablaImprimir() {

    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {}, // PASA EL TERMINO DE BUSQUEDA AL CONTROLADOR
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
                    <td style="text-align: center">${empresa.rubroNombre}</td>
                    <td style="text-align: center">${empresa.cuit_Cdi}</td>
                    <td style="text-align: center">${empresa.telefono}</td>
                    <td style="text-align: center">${empresa.email}</td>
                    <td style="text-align: center">${empresa.provinciaNombre}</td>
                    <td style="text-align: center">${empresa.localidadNombre}</td>
                    <td style="text-align: center">${empresa.domicilio}</td>
                </tr>
             `;
            });

            document.getElementById("tbody-empresasImprimir").innerHTML = contenidoTabla;

            window.onload = setTimeout("TraerIdUsuario();", 500);
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });

}

function TraerIdUsuario() {

    //GUARDAMOS EN UNA VARIABLE EL USUARIO OBTENIDO EN LA URL
    var usuarioID = $("#idUsuarioTraer").val();

    if (usuarioID != "") {
        //PETICION AJAX PARA OBTENER EMAIL DEL USUARIO
        $.ajax({
            url: '/Users/ListadoUsuarios',
            data: { UsuarioID: usuarioID },
            type: 'GET',
            dataType: 'json',
            success: function (usuariosMostrar) {

                let usuarioMostrar = usuariosMostrar[0];

                $("#UsuarioID").val(usuarioMostrar.email);
                $("#modalEmpresas").modal('show');
                $("#tituloModal").text("Nuevo Cliente")
            },
            error: function () {
                alert('Error al obtener los datos del usuario.');
            }
        });
    }

}

function GuardarEmpresa() {
    $("#razonSocialError").html("");
    $("#cuitError").html("");
    $("#telefonoEmpresaError").html("");
    $("#emailEmpresaError").html("");
    $("#domicilioEmpresaError").html("");
    $("#localidadEmpresaError").html("");
    $("#provinciaEmpresaError").html("");
    $("#usuarioEmpresaError").html("");
    $("#rubroError").html("");

    let empresaID = $("#EmpresaID").val();
    let razonSocial = $("#RazonSocial").val().trim();
    let cuit = $("#Cuit").val().trim();
    let telefono = $("#telefono").val().trim();
    let email = $("#email").val().trim();
    let localidadID = $("#LocalidadID").val();
    let domicilio = $("#domicilio").val();
    let usuarioID = $("#UsuarioID").val();
    let rubroID = $("#RubroID").val();

    console.log(usuarioID)

    let registrado = true;

    if (razonSocial == "") {
        $("#razonSocialError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La razon social de la empresa es requerida.")
        registrado = false;
    }

    if (cuit == "") {
        $("#cuitError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  CUIT requerido.")
        registrado = false;
    }

    if (telefono == "") {
        $("#telefonoEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Teléfono requerido.")
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
    if (usuarioID == null) {
        $("#usuarioEmpresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El usuario es requerido.")
        registrado = false;
    }
    if (rubroID == 0) {
        $("#rubroError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El rubro es requerido.")
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
                Domicilio: domicilio,
                RubroID: rubroID
            },
            type: 'POST',
            dataType: 'json',
            success: function (resultado) {

                if (resultado != "") {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "bottom-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        background: '#e2ffd4',
                        width: "380px",
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        title: (resultado),
                    });
                }
                location.href = `../Empresas/Empresas`;
                ListadoEmpresas();

            },
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
                    text: "Disculpe, existió un problema al guardar la empresa",
                });
            }
        });

    }

}

function AbrirModalEditar(empresaID) {
    console.log(empresaID);
    $.ajax({
        async: false,
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { EmpresaID: empresaID },
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
            BuscarLocalidades();

            $("#LocalidadID").val(mostrarEmpresas.localidadID);
            $("#domicilio").val(mostrarEmpresas.domicilio);
            $("#UsuarioID").val(mostrarEmpresas.emailUsuario)
            $("#RubroID").val(mostrarEmpresas.rubroID)
            $("#modalEmpresas").modal("show");
            $("#tituloModal").text("Editar Cliente");
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}

function EliminarEmpresa(empresaID) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: "btn btn-secondary",
            confirmButton: "btn btn-danger m-2",
        },
        buttonsStyling: false,

    });
    swalWithBootstrapButtons.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "question",
        background: '#ffeeee',
        showCancelButton: true,
        confirmButtonText: "¡Sí, eliminar!",
        cancelButtonText: "¡No, cancelar!",
        reverseButtons: false,
        width: '350px',
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
                success: function (resultado) {

                    if (!resultado) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "bottom-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            background: '#fcffe7',
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "warning",
                            title: "Oops...",
                            text: "No se puede eliminar, existen registros asociados",
                        });
                    }

                    ListadoEmpresas();
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
                        text: "Disculpe, existió un problema al eliminar la empresa.",
                    });
                }
            });

            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#e2ffd4',
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "¡Borrado!",
                text: "La empresa ha sido eliminada.",
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
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
                title: "Anulado",
                text: "Tu registro está a salvo.",
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

document.addEventListener("keydown", function (event) {
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

document.addEventListener("keydown", function (event) {
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

function openModalInfoTablas() {
    var modal = document.getElementById("ModalInfoTablas");
    modal.style.display = "block";
}

function closeModalInfoTablas() {
    var modal = document.getElementById("ModalInfoTablas");
    modal.style.display = "none";
}

function handleEntendido() {
    closeModalInfoTablas();
    // openModalImpresion();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModalInfoTablas();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalInfoTablas");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarModal(razonSocial, rubroNombre, cuit_Cdi, telefono, email, provinciaNombre, localidadNombre, domicilio) {
    $('#razonSocial').text('Razón Social: ' + razonSocial);
    $('#rubroNombre').text('Rubro: ' + rubroNombre);
    $('#cuit_Cdi').text('CUIT: ' + cuit_Cdi);
    $('#telefonoDetalle').text('Teléfono: ' + telefono);
    $('#emailDetalle').text('Email: ' + email);
    $('#provinciaNombre').text('Provincia: ' + provinciaNombre);
    $('#localidadNombre').text('Localidad: ' + localidadNombre);
    $('#domicilioDetalle').text('Domicilio: ' + domicilio);

    $('#modalDetalles').show();
}

function cerrarModal() {
    // Oculta el modal
    document.getElementById('modalDetalles').style.display = "none";
}

// Cierra el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('modalDetalles');
    if (event.target === modal) {
        cerrarModal();
    }
}


$(document).ready(function () {
    $('#Cuit').mask('00-00000000-0');
    $('#telefono').mask('(00) 0000-000000');
});