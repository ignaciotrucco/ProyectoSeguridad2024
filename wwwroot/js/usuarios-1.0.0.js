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
    document.getElementById("userNameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

function GuardarUsuario() {
    let username = $("#username").val().trim();
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    let rol = $("#RolID").val();

    let registrado = true;

    if (username == "") {
        $("#userNameError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El username es requerido.");
    }
    if (email == "") {
        $("#emailError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El email es requerido.");
    }
    if (password == "") {
        $("#passwordError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La contraseña es requerida.");
    }

    if (registrado) {
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
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Disculpe, existió un problema al guardar el usuario",
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    }

}

function AbrirModalEditar(usuarioID) {
    console.log(usuarioID)
    $.ajax({
        // la URL para la petición
        url: '../../Users/ListadoUsuarios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {UsuarioID: usuarioID},
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

function EliminarUsuario(usuarioID) {

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
                success: function (resultado) {

                    if (!resultado) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se puede eliminar, existen registros asociados",
                        });
                    }

                    ListadoUsuarios();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Disculpe, existió un problema al eliminar el usuario",
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

function openModalContraseña() {
    var modal = document.getElementById("ModalContraseña");
    modal.style.display = "block";
}

function closeModalContraseña() {
    var modal = document.getElementById("ModalContraseña");
    modal.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModalContraseña();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalContraseña");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
