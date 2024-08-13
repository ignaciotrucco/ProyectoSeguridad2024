window.onload = ListadoPersonas();

function ListadoPersonas() {
    $.ajax({
        url: '../../Personas/ListadoPersonas',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (personasMostrar) {

            $("#modalPersonas").modal("hide");
            LimpiarModal()

            let contenidoCard = ``;

            $.each(personasMostrar, function (index, persona) {

                contenidoCard += `
            <div class="col-lg-3 col-md-3 col-sm-12">
                <div class="card cardPersonas">
                    <img src="../img/usuario-fondo-negro.png" class="card-img-top">
                    <div class="card-body cardbodyPersonas">
                        <h4 class="cardPersonas card-title">${persona.nombreCompleto}</h4>
                        <p class="cardPersonas card-text">${persona.tipoDocumentoNombre} - ${persona.numeroDocumento}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="datosPersona list-group-item">${persona.localidadNombre} - ${persona.provinciaNombre}</li>
                        <li class="datosPersona list-group-item">Télefono: ${persona.telefono}</li>
                        <li class="datosPersona list-group-item">Domicilio: ${persona.domicilio}</li>
                        <li class="datosPersona list-group-item">${persona.email}</li>
                        <li class="datosPersona list-group-item">Nacido el: ${persona.fechaNacimientoString}</li>
                        <li class="btnPersonas list-group-item">
                        <button type="button" class="btn btn-dark" title="Editar" onclick="ModalEditar(${persona.personaID})">
                        Editar
                        </button>
                        <button type="button" class="btn btn-dark" title="Eliminar" onclick="EliminarPersona(${persona.personaID})">
                        Eliminar
                        </button>
                        </li>
                    </ul>
                </div> 
            </div>        

             `;
            });

            document.getElementById("cbody-personas").innerHTML = contenidoCard;

        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
            console.error('Error details:', xhr, status);
        }
    });
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
                localidadDropdown.append('<option value="">[SELECCIONE UNA LOCALIDAD...]</option>');
                $.each(data, function (index, item) {
                    localidadDropdown.append('<option value="' + item.localidadID + '">' + item.nombre + '</option>');
                });
            }
        });
    }
    else {
        $('#LocalidadID').empty();
        $('#LocalidadID').append('<option value="">[SELECCIONE UNA LOCALIDAD...]</option>');
    }
});

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
    document.getElementById("FechaNacimiento").value = 0;
    document.getElementById("nombrePersonaError").innerHTML = "";
    document.getElementById("domicilioPersonaError").innerHTML = "";
    document.getElementById("tipoDocPersonaError").innerHTML = "";
    document.getElementById("nroDocPersonaError").innerHTML = "";
    document.getElementById("telefonoPersonaError").innerHTML = "";
    document.getElementById("fechaPersonaError").innerHTML = "";
    document.getElementById("emailPersonaError").innerHTML = "";
    document.getElementById("localidadPersonaError").innerHTML = "";
    document.getElementById("provinciaPersonaError").innerHTML = "";
}

function GuardarPersona() {
    let personaid = document.getElementById("PersonaID").value;
    let nombre = document.getElementById("Nombre").value.trim();
    let domicilio = document.getElementById("Domicilio").value.trim();
    let tipdoc = document.getElementById("TipoDocumentoID").value;
    let nrodoc = document.getElementById("NroDoc").value.trim();
    let telefono = document.getElementById("Telefono").value.trim();
    let email = document.getElementById("Email").value;
    let localidadid = document.getElementById("LocalidadID").value;
    let emailUsuario = document.getElementById("emailUsuario").value;
    let fechanac = document.getElementById("FechaNacimiento").value;

    let registrado = true;

    if (nombre == "") {
        $("#nombrePersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El nombre es requerido.")
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
        $("#fechaPersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Fecha requerida.")
        registrado = false;
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

        $.ajax({
            url: '../../Personas/GuardarPersonas',
            data: {
                PersonaID: personaid,
                LocalidadID: localidadid,
                TipoDocumentoID: tipdoc,
                EmailUsuario: emailUsuario,
                NombreCompleto: nombre,
                FechaNacimiento: fechanac,
                Telefono: telefono,
                Domicilio: domicilio,
                Email: email,
                NumeroDocumento: nrodoc
            },
            type: 'POST',
            dataType: 'json',
            success: function (resultado) {

                if (resultado != "") {
                    Swal.fire(resultado);
                }

                ListadoPersonas();
            },
            error: function (xhr, status) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Disculpe, existió un problema al guardar la persona",
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });

    }

}

{/* <div class="col-lg-3 col-md-3 col-sm-12">
    <div class="card"">
    <img src="../img/img_usuario.png" class="card-img-top">
        <div class="card-body" id="cbody-personas">
            <h5 class="card-title text-center">${persona.nombreCompleto} - ${persona.localidadID}</h5>
            <p class="card-text">${persona.telefono}</p>
            <p class="card-text">${persona.domicilio}</p>
            <p class="card-text">${persona.email}</p>
            <p class="card-text">${persona.tipoDocumentoID} - ${persona.numeroDocumento}</p>
            <p class="card-text">${persona.fechaNacimiento}</p>
        </div>
</div>
                </div > */}


function ModalEditar(personaID) {

    $.ajax({
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
            document.getElementById("LocalidadID").value = mostrarPersona.localidadID;
            document.getElementById("emailUsuario").value = mostrarPersona.usuarioID;
            
            //CONVERTIMOS LA FECHA DE NACIMIENTO EN FORMATO YYYY-MM-DD PARA PODER MOSTRARLO EN EL INPUT
            let fechaNacimiento = new Date(mostrarPersona.fechaNacimiento);
            let formatoDate = fechaNacimiento.toISOString().split('T')[0]; //SE SEPARAN LAS PARTES DE LA FECHA Y LA HORA PARA PODER MOSTRAR SOLO FECHA QUE SERIA [0];

            document.getElementById("FechaNacimiento").value = formatoDate;
            $("#modalPersonas").modal("show");
            $("#tituloModal").text("Editar Persona");
        },
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema",
                timer: 2000,
                timerProgressBar: true
            });
            console.error('Error details:', xhr, status);
        }
    });

}

function EliminarPersona(personaID) {
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
                success: function (eliminarPersona) {

                    // if (!resultado) {
                    //     Swal.fire({
                    //         icon: "error",
                    //         title: "Oops...",
                    //         text: "No se puede eliminar, existen registros asociados",
                    //     });
                    // }

                    ListadoPersonas();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Disculpe, existió un problema al eliminar la persona",
                        timer: 2000,
                        timerProgressBar: true
                    });
                }
            });

            swalWithBootstrapButtons.fire({
                title: "¡Borrado!",
                text: "Su registro ha sido eliminado.",
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Anulado",
                text: "Tu registro está a salvo :)",
                icon: "error",
                timer: 2000,
                timerProgressBar: true
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

function openModalDni() {
    var modal = document.getElementById("ModalDni");
    modal.style.display = "block";
}

function closeModalDni() {
    var modal = document.getElementById("ModalDni");
    modal.style.display = "none";
}

document.addEventListener("keydown", function(event) {
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

$(document).ready(function(){
    $('#Telefono').mask('(00) 0000-000000');
});