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
  // document.getElementById("userNameError").innerHTML = "";
  document.getElementById("emailError").innerHTML = "";
  document.getElementById("passwordError").innerHTML = "";
}
function LimpiarModalEditar() {
  $("#UsuarioEditarID").val("");
  $("#emailEditar").val("");
}

function ListadoUsuarios() {
  let rolIDbuscar = $("#RolIDBuscar").val();
  $.ajax({
    // la URL para la petición
    url: '../../Users/ListadoUsuarios',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { rolIDbuscar: rolIDbuscar },
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
                    <button type="button" class="btn" title="Cambiar Contraseña" onclick="ValidarNuevaContraseña('${usuario.usuarioID}')">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn ocultar-en-767px" title="Eliminar" onclick="EliminarUsuario('${usuario.usuarioID}')">
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

function GuardarUsuario() {
  let email = $("#email").val().trim();
  let password = $("#password").val().trim();
  let rol = $("#RolID").val();

  let registrado = true;

  // Validaciones
  if (email == "") {
    $("#emailError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  El email es requerido.");
    registrado = false;
  }
  if (password == "") {
    $("#passwordError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La contraseña es requerida.");
    registrado = false;
  }

  // Si todas las validaciones son correctas, proceder a la llamada AJAX
  if (registrado) {
    $.ajax({
      url: '../../Users/GuardarUsuario',
      data: { Username: email, Email: email, Password: password, rol: rol },
      type: 'POST',
      dataType: 'json',
      success: function (mensaje) {

        if (mensaje != "") {
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
            title: (mensaje),
          });
        }
        ListadoUsuarios();
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
          text: "Disculpe, existió un problema al guardar el usuario",
        });
      }
    });
  }
}


function ValidarNuevaContraseña(usuarioID) {
  Swal.fire({
    title: "¿Seguro que quiere restablecer la contraseña de este usuario?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#606060",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, seguro",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      RestablecerContrasenia(usuarioID)
    }
  });
}


function RestablecerContrasenia(usuarioID) {
  $.ajax({
    // la URL para la petición
    url: '../../Users/RestablecerContrasenia',
    // la información a enviar
    data: { UsuarioID: usuarioID },
    // especifica si será una petición POST o GET
    type: 'GET',
    // el tipo de información que se espera de respuesta
    dataType: 'json',
    // código a ejecutar si la petición es satisfactoria;
    success: function (data) {
      if (data) {
        const nuevaContrasenia = data.nuevaContrasenia;
        navigator.clipboard.writeText(nuevaContrasenia).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña Restablecida (Copiada al portapapeles)',
            text: `La nueva contraseña es: ${nuevaContrasenia}`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: "#606060",
          });
        }).catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo copiar la contraseña al portapapeles.',
            confirmButtonText: 'Aceptar'
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.errores,
          confirmButtonText: 'Aceptar'
        });
      }
    },
    // código a ejecutar si la petición falla;
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

function EliminarUsuario(usuarioID) {

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

          if (resultado.motivo == 1) {
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
              text: "No se puede eliminar porque es el usuario logueado",
            });
          }

          else if (resultado.motivo == 2) {
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

          ListadoUsuarios();
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
            text: "Disculpe, existió un problema al eliminar el usuario.",
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
        text: "El usuario ha sido eliminado.",
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

function openModalContraseña() {
  var modal = document.getElementById("ModalContraseña");
  modal.style.display = "block";
}

function closeModalContraseña() {
  var modal = document.getElementById("ModalContraseña");
  modal.style.display = "none";
}

document.addEventListener("keydown", function (event) {
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

// function openModalImpresion() {
//   var modal = document.getElementById("ModalImpresion");
//   modal.style.display = "block";
// }

// function closeModalImpresion() {
//   var modal = document.getElementById("ModalImpresion");
//   modal.style.display = "none";
// }

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