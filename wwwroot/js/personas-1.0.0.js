window.onload = ListadoPersonas();

$(document).ready(function () {
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
});



function ListadoPersonas() {
    $.ajax({
        url: '../../Personas/listadoPersonas',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (listadoPersonas) {

            // $("#modalPersonas").modal("hide");
            // LimpiarModal()

            let contenidoCard = ``;

            $.each(listadoPersonas, function (index, persona) {

                contenidoCard += `
            <div class="col-lg-3 col-md-3 col-sm-12">
                <div class="card">
                    <img src="../img/img_usuario.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${persona.nombreCompleto}</h5>
                        <p class="card-text">${persona.tipoDocumentoID} - ${persona.numeroDocumento}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${persona.localidadID}</li>
                        <li class="list-group-item">${persona.telefono}</li>
                        <li class="list-group-item">${persona.domicilio}</li>
                        <li class="list-group-item">${persona.email}</li>
                        <li class="list-group-item">${persona.fechaNacimiento}</li>
                    </ul>
                </div> 
            </div>        

             `;
            });

            document.getElementById("cbody-personas").innerHTML = contenidoCard;

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