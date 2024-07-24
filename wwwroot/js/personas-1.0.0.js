window.onload = ListadoPersonas();


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
    document.getElementById("UsuarioID").value = "";
}

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
                <div class="card">
                    <img src="../img/usuario-fondo-negro.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${persona.nombreCompleto}</h5>
                        <p class="card-text">${persona.tipoDocumentoNombre} - ${persona.numeroDocumento}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${persona.localidadNombre} - ${persona.provinciaNombre}</li>
                        <li class="list-group-item">${persona.telefono}</li>
                        <li class="list-group-item">${persona.domicilio}</li>
                        <li class="list-group-item">${persona.email}</li>
                        <li class="list-group-item">${persona.fechaNacimientoString}</li>
                        <li class="list-group-item">
                        <button type="button" class="btn" title="Editar" onclick="ModalEditar(${persona.personaID})">
                            <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                        </button>
                        <button type="button" class="btn" title="Eliminar" onclick="">
                        <i class="fa-solid fa-trash" width="20" height="20"></i>
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

function GuardarPersona() {
    let personaid = document.getElementById("PersonaID").value;
    let nombre = document.getElementById("Nombre").value;
    let domicilio = document.getElementById("Domicilio").value;
    let tipdoc = document.getElementById("TipoDocumentoID").value;
    let nrodoc = document.getElementById("NroDoc").value;
    let telefono = document.getElementById("Telefono").value;
    let email = document.getElementById("Email").value;
    let localidadid = document.getElementById("LocalidadID").value;
    let usuarioid = document.getElementById("UsuarioID").value;
    let fechanac = document.getElementById("FechaNacimiento").value;

    $.ajax({
        url: '../../Personas/GuardarPersonas',
        data: {
            PersonaID: personaid,
            LocalidadID: localidadid,
            TipoDocumentoID: tipdoc,
            UsuarioID: usuarioid,
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
            if (resultado != "")
            {
                Swal.fire(resultado);
            }
            ListadoPersonas();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });

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
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (personasMostrar) {
            let mostrarPersona = personasMostrar[0];

            $("#PersonaID").val(personaID);
            $("#Nombre").val(mostrarPersona.nombreCompleto);
            $("#Domicilio").val(mostrarPersona.domicilio);
            $("#TipoDocumentoID").val(mostrarPersona.tipoDocumentoID);
            $("#NroDoc").val(mostrarPersona.numeroDocumento);
            $("#Telefono").val(mostrarPersona.telefono);
            $("#Email").val(mostrarPersona.email);
            $("#LocalidadID").val(mostrarPersona.localidadID);
            $("#ProvinciaID").val(mostrarPersona.provinciaID);
            $("#UsuarioID").val(mostrarPersona.usuarioid);
            $("#FechaNacimiento").val(mostrarPersona.fechaNacimiento)
            $("#modalPersonas").modal("show");
            $("#tituloModal").text("Editar Persona");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
            console.error('Error details:', xhr, status);
        }
    });

}