window.onload = ListadoLocalidades();

function LimpiarModal() {
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("Nombre").value = "";
    document.getElementById("CP").value = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Provincia")
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
        success: function (listadoLocalidades) {

            $("#modalLocalidades").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(listadoLocalidades, function (index, localidad) {

                contenidoTabla += `
                <tr>
                    <td>${localidad.nombre}</td>
                    <td>${localidad.codigoPostal}</td>
                    <td>${localidad.provinciaID}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success btn-sm" onclick="ModalEditar(${localidad.localidadID})">
                    Editar
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" onclick="EliminarLocalidad(${localidad.localidadID})">
                    Eliminar
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
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function GuardarLocalidad() {
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("Nombre").value;
    let codigoPostal = document.getElementById("CP").value;

    console.log(localidadID + " - " + provinciaID + " - " + nombre + " - " + codigoPostal);

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
                alert(resultado);
            }
            ListadoLocalidades();
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
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
        success: function (listadoLocalidades) {
            let listadoLocalidad = listadoLocalidades[0];

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
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function EliminarLocalidad(localidadID) {
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
        success: function (eliminarLocalidad) {
            ListadoLocalidades()
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}