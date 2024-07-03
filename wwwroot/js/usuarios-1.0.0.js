window.onload = ListadoUsuarios();

function ListadoUsuarios() {
    $.ajax({
        // la URL para la petición
        url: '../../Users/ListadoUsuarios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {  },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (usuariosMostrar) {

            // $("#modalProvincias").modal("hide");
            // LimpiarModal()
            
            let contenidoTabla = ``;

            $.each(usuariosMostrar, function (index, usuario) {  
                
                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${usuario.usuarioID}</td>
                    <td style="text-align: center">${usuario.email}</td>
                    <td style="text-align: center">${usuario.rolNombre}</td>
                    <td style="text-align: center">${usuario.personaNombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn btn-danger btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-usuarios").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}