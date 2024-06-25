window.onload = ListadoProvincias();

function LimpiarModal() {
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("NombreProvincia").value = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Provincia")
}

function ListadoProvincias(){
 
    $.ajax({
        // la URL para la petición
        url: '../../Provincias/ListadoProvincias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {  },
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
                    <td>${provincia.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success btn-sm" onclick="ModalEditar(${provincia.provinciaID})">
                    Editar
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" onclick="EliminarProvincia(${provincia.provinciaID})">
                    Eliminar
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
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("NombreProvincia").value;

    console.log(provinciaID + " - " + nombre)

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
                alert(resultado);
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
        success: function (eliminarProvincia) {
            ListadoProvincias()          
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}