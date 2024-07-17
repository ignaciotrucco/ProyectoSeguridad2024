window.onload = ListadoUsuarios();

function NuevoUsuario() {
    $("#tituloModal").text("Nuevo Usuario");
}

function LimpiarModal() {
    $("#UsuarioID").val("");
    $("#username").val("");
    $("#email").val("");
    $("#password").val("");
    $("#RolID").val(0);
}
function LimpiarModalEditar() {
    $("#UsuarioEditarID").val("");
    $("#emailEditar").val("");
}

function ListadoUsuarios() {
    $.ajax({
        // la URL para la petición
        url: '../../Users/ListadoUsuarios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (usuariosMostrar) {

            $("#modalUsuarios").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(usuariosMostrar, function (index, usuario) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${usuario.email}</td>
                    <td style="text-align: center">${usuario.rolNombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="AbrirModalEditar('${usuario.usuarioID}')">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarUsuario('${usuario.usuarioID}')">
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

function GuardarUsuario() {
    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let rol = $("#RolID").val();

    $.ajax({
        // la URL para la petición
        url: '../../Users/GuardarUsuario',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { Username: username, Email: email, Password: password, rol: rol },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (result) {

            ListadoUsuarios();
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function AbrirModalEditar(usuarioID) {
    console.log(usuarioID)
    $.ajax({
        // la URL para la petición
        url: '../../Users/ListadoUsuarios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (usuariosMostrar) {
            let usuarioMostrar = usuariosMostrar[0];

            document.getElementById("UsuarioEditarID").value = usuarioID;
            document.getElementById("emailEditar").value = usuarioMostrar.email;
            $("#tituloModalEditar").text("Editar Usuario");
            $("#modalEditarUsuarios").modal("show");

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function EliminarUsuario(usuarioID) {
    $.ajax({
        // la URL para la petición
        url: '../../Users/EliminarUsuario',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { UsuarioID: usuarioID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (eliminarUsuario) {

            ListadoUsuarios();
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}