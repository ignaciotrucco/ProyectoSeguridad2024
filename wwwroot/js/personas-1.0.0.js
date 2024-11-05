window.onload = ListadoPersonas();

function NuevaPersona() {
    $("#tituloModal").text("Nueva Persona");
}

function LimpiarModal() {
    document.getElementById("PersonaID").value = 0;
    document.getElementById("Nombre").value = "";
    document.getElementById("Domicilio").value = "";
    document.getElementById("TipoDocumentoID").value = 0;
    document.getElementById("NroDoc").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("emailUsuario").value = "";
    document.getElementById("FechaNacimiento").value = "";
    document.getElementById("nombrePersonaError").innerHTML = "";
    document.getElementById("domicilioPersonaError").innerHTML = "";
    document.getElementById("tipoDocPersonaError").innerHTML = "";
    document.getElementById("nroDocPersonaError").innerHTML = "";
    document.getElementById("telefonoPersonaError").innerHTML = "";
    document.getElementById("fechaPersonaError").innerHTML = "";
    document.getElementById("emailPersonaError").innerHTML = "";
    document.getElementById("localidadPersonaError").innerHTML = "";
    document.getElementById("provinciaPersonaError").innerHTML = "";
    document.getElementById("usuarioPersonaError").innerHTML = "";
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
// $(document).ready(function () {
//     $('#inputBusqueda').on('keyup', function () {
//         let busqueda = $(this).val();
//         ListadoPersonas(busqueda);
//     });
// });


function ListadoPersonas(busqueda) {

    let rolBuscar = $("#rolBuscar").val();

    $.ajax({
        url: '../../Personas/ListadoPersonas',
        data: {
            busqueda: busqueda,
            RolBuscar: rolBuscar
        },  // PASA EL TERMINO DE BUSQUEDA AL CONTROLADOR
        type: 'POST',
        dataType: 'json',
        success: function (personasMostrar) {

            $("#modalPersonas").modal("hide");
            LimpiarModal()

            let contenidoCard = ``;

            $.each(personasMostrar, function (index, persona) {

            let imagenHtml = '';
            if (persona.nombreArchivo) {
                imagenHtml = `
                        <img src="data:${persona.contentType};base64,${persona.nombreArchivo}" class="card-img-top fotoUsuario">
                `;
            }
            else {
                imagenHtml = '<img src="../../img/usuario-fondo-negro.png" class="card-img-top fotoUsuario">'
            }

                contenidoCard += `
            <div class="col-lg-4 col-md-4 col-sm-12">
                <div class="card cardPersonas">
                    ${imagenHtml}
                    <div class="card-body cardbodyPersonas">
                        <h4 class="card-title">
                ${persona.nombreCompleto.length > 18
                        ? persona.nombreCompleto.split(' ')[0] + ' ' + persona.nombreCompleto.split(' ')[1].charAt(0) + '. ' + persona.nombreCompleto.split(' ')[2]
                        : persona.nombreCompleto}
                        </h4>
                        <p class="cardPersonas card-text">(${persona.rolPersona}) ${persona.tipoDocumentoNombre} - ${persona.numeroDocumento}</p>
                    </div>
                    <div class="btnPersonas">
                    <button type="button" class="btn btn-dark" title="Detalles" onclick="mostrarModal(
                    '${persona.rolPersona}', '${persona.tipoDocumentoNombre}', '${persona.numeroDocumento}', '${persona.localidadNombre}', 
                    '${persona.provinciaNombre}', '${persona.domicilio}', '${persona.telefono}', '${persona.email}', '${persona.nombreCompleto}', 
                    '${persona.fechaNacimientoString}')">
                        <i class="fa-solid fa-info" width="20" height="20" style="color:white"></i>
                    </button>
                        <button type="button" class="btn btn-dark" title="Editar" onclick="ModalEditar(${persona.personaID})">
                            Editar
                        </button>
                        <button type="button" class="btn btn-danger" title="Eliminar" onclick="EliminarPersona(${persona.personaID})">
                            Eliminar
                        </button>
                    </div>
                </div> 
            </div>        

             `;
            });

            document.getElementById("cbody-personas").innerHTML = contenidoCard;
            TablaImprimir();

        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
            console.error('Error details:', xhr, status);
        }
    });
}

function TablaImprimir() {

    $.ajax({
        url: '../../Personas/ListadoPersonas',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (personasMostrar) {

            $("#modalPersonas").modal("hide");
            LimpiarModal();

            let contenidoTabla = ``;

            $.each(personasMostrar, function (index, persona) {
                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${persona.nombreCompleto}</td>
                    <td style="text-align: center">${persona.rolPersona}</td>
                    <td style="text-align: center">${persona.tipoDocumentoNombre} - ${persona.numeroDocumento}</td>
                    <td style="text-align: center">${persona.provinciaNombre}</td>
                    <td style="text-align: center">${persona.localidadNombre}</td>
                    <td style="text-align: center">${persona.domicilio}</td>
                    <td style="text-align: center">${persona.telefono}</td>
                    <td style="text-align: center">${persona.email}</td>                
                    <td style="text-align: center">${persona.fechaNacimientoString}</td>                               
                </tr>
             `;
            });

            document.getElementById("tbody-personasImprimir").innerHTML = contenidoTabla;

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

                let usuarioMostrar = usuariosMostrar[0]

                $("#emailUsuario").val(usuarioMostrar.email);
                $("#modalPersonas").modal('show');
                $("#tituloModal").text("Nueva Persona");
            },
            error: function () {
                alert('Error al obtener los datos del usuario.');
            }
        });
    }
}

function GuardarPersona() {
    $("#nombrePersonaError").html("");
    $("#usuarioPersonaError").html("");
    $("#domicilioPersonaError").html("");
    $("#tipoDocPersonaError").html("");
    $("#nroDocPersonaError").html("");
    $("#telefonoPersonaError").html("");
    $("#fechaPersonaError").html("");
    $("#emailPersonaError").html("");
    $("#localidadPersonaError").html("");
    $("#provinciaPersonaError").html("");

    let personaid = document.getElementById("PersonaID").value;
    let nombre = document.getElementById("Nombre").value.trim();
    let usuarioID = document.getElementById("emailUsuario").value.trim();
    let domicilio = document.getElementById("Domicilio").value.trim();
    let tipdoc = document.getElementById("TipoDocumentoID").value;
    let nrodoc = document.getElementById("NroDoc").value.trim();
    let telefono = document.getElementById("Telefono").value.trim();
    let email = document.getElementById("Email").value;
    let localidadid = document.getElementById("LocalidadID").value;
    let emailUsuario = document.getElementById("emailUsuario").value;
    let fechanac = document.getElementById("FechaNacimiento").value;
    let imagenPersona = $("#imgPersona")[0].files[0]; // Obtener la imagen

    let registrado = true;

    if (nombre == "") {
        $("#nombrePersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El nombre es requerido.")
        registrado = false;
    }
    if (usuarioID == "") {
        $("#usuarioPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El usuario es requerido.")
        registrado = false;
    }

    if (domicilio == "") {
        $("#domicilioPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El domicilio es requerido.")
        registrado = false;
    }

    if (tipdoc == 0) {
        $("#tipoDocPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Requerido.")
        registrado = false;
    }

    if (nrodoc == "") {
        $("#nroDocPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  N° Doc. Requerido.")
        registrado = false;
    }

    if (telefono == "") {
        $("#telefonoPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El teléfono es requerido.")
        registrado = false;
    }

    if (fechanac == 0) {
        $("#fechaPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Fecha requerida.");
        registrado = false;
    } else {
        const fechaNacimiento = new Date(fechanac);
        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        if (edad < 18) {
            $("#fechaPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Debe ser mayor de 18 años.");
            registrado = false;
        }
    }

    if (email == "") {
        $("#emailPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El email de contacto es requerido.")
        registrado = false;
    }

    if (localidadid == 0) {
        $("#localidadPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La localidad es requerida.")
        registrado = false;
    }

    if (localidadid == 0) {
        $("#provinciaPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La provincia es requerida.")
        registrado = false;
    }

    if (registrado) {
        let formData = new FormData();
        formData.append("PersonaID", personaid);
        formData.append("LocalidadID", localidadid);
        formData.append("TipoDocumentoID", tipdoc);
        formData.append("EmailUsuario", emailUsuario);
        formData.append("NombreCompleto", nombre);
        formData.append("FechaNacimiento", fechanac);
        formData.append("Telefono", telefono);
        formData.append("Domicilio", domicilio);
        formData.append("Email", email);
        formData.append("NumeroDocumento", nrodoc);

        // Verificar si hay una imagen seleccionada antes de agregarla al FormData
        if (imagenPersona) {
            formData.append("ImagenPersona", imagenPersona);
        }

        $.ajax({
            url: '../../Personas/GuardarPersonas',
            data: formData,
            processData: false, // Evitar que jQuery procese los datos
            contentType: false, // Evitar que jQuery establezca el tipo de contenido
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
                location.href = `../Personas/Personas`;
                ListadoPersonas();
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
                    text: "Disculpe, existió un problema al cargar las personas",
                });
            }
        });
    }
}


function ModalEditar(personaID) {

    $.ajax({
        async: false,
        url: '../../Personas/ListadoPersonas',
        data: { PersonaID: personaID },
        type: 'POST',
        dataType: 'json',
        success: function (personasMostrar) {
            let mostrarPersona = personasMostrar[0];

            document.getElementById("PersonaID").value = personaID;
            document.getElementById("Nombre").value = mostrarPersona.nombreCompleto;
            document.getElementById("Domicilio").value = mostrarPersona.domicilio;
            document.getElementById("TipoDocumentoID").value = mostrarPersona.tipoDocumentoID;
            document.getElementById("NroDoc").value = mostrarPersona.numeroDocumento;
            document.getElementById("Telefono").value = mostrarPersona.telefono;
            document.getElementById("Email").value = mostrarPersona.email;
            document.getElementById("ProvinciaID").value = mostrarPersona.provinciaID;
            BuscarLocalidades();

            document.getElementById("LocalidadID").value = mostrarPersona.localidadID;
            document.getElementById("emailUsuario").value = mostrarPersona.emailUsuario;

            //CONVERTIMOS LA FECHA DE NACIMIENTO EN FORMATO YYYY-MM-DD PARA PODER MOSTRARLO EN EL INPUT
            let fechaNacimiento = new Date(mostrarPersona.fechaNacimiento);
            let formatoDate = fechaNacimiento.toISOString().split('T')[0]; //SE SEPARAN LAS PARTES DE LA FECHA Y LA HORA PARA PODER MOSTRAR SOLO FECHA;

            document.getElementById("FechaNacimiento").value = formatoDate;
            $("#modalPersonas").modal("show");
            $("#tituloModal").text("Editar Persona");
            console.log(mostrarPersona.localidadID);
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
                text: "Disculpe, existió un problema",
            });
            console.error('Error details:', xhr, status);
        }
    });

}

function EliminarPersona(personaID) {
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
                url: '../../Personas/EliminarPersona',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { PersonaID: personaID },
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

                    ListadoPersonas();
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
                        text: "Disculpe, existió un problema al eliminar la persona.",
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
                text: "La persona ha sido eliminada.",
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

function openModalDni() {
    var modal = document.getElementById("ModalDni");
    modal.style.display = "block";
}

function closeModalDni() {
    var modal = document.getElementById("ModalDni");
    modal.style.display = "none";
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModalDni();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalDni");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarModal(rolPersona, tipoDocumentoNombre, numeroDocumento, localidadNombre, provinciaNombre, domicilio, telefono, email, nombreCompleto, fechaNacimientoString) {
    $('#nombreCompleto').text(nombreCompleto + ' - ' + rolPersona);
    $('#fechaNacimientoString').text('Fecha de nacimiento: ' + fechaNacimientoString);
    $('#tipoDocumentoNombre').text(tipoDocumentoNombre + ': ' + numeroDocumento);
    $('#telefono').text('Teléfono: ' + telefono);
    $('#email').text('Email: ' + email);
    $('#provinciaNombre').text('Provincia: ' + provinciaNombre);
    $('#localidadNombre').text('Localidad: ' + localidadNombre);
    $('#domicilio').text('Domicilio: ' + domicilio);

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
    $('#Telefono').mask('(00) 0000-000000');
});