window.onload = ListadoLocalidades();

function LimpiarModal() {
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("Nombre").value = "";
    document.getElementById("CP").value = "";
    document.getElementById("NombreError").innerHTML = "";
    document.getElementById("ProvinciaError").innerHTML = "";
}

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Localidad")
}

// ESCUCHA EL EVENTO 'KEYUP' EN EL CAMPO DE BÚSQUEDA CON ID 'INPUTBUSQUEDA'
// CADA VEZ QUE EL USUARIO ESCRIBE, SE CAPTURA EL VALOR ACTUAL Y SE LLAMA A LA FUNCIÓN LISTADOPERSONAS
// PARA FILTRAR LA LISTA DE PERSONAS SEGÚN EL TEXTO INGRESADO.
$(document).ready(function () {
    $('#inputBusqueda').on('keyup', function () {
        let busqueda = $(this).val();
        ListadoLocalidades(busqueda);
    });
});

function ListadoLocalidades(busqueda) {

    $.ajax({
        // la URL para la petición
        url: '../../Localidades/ListadoLocalidades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { busqueda: busqueda },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (localidadesMostrar) {

            $("#modalLocalidades").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(localidadesMostrar, function (index, localidad) {

                let datoNulo = localidad.codigoPostal ?? "----";

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${localidad.nombre}</td>
                    <td style="text-align: center">${datoNulo}</td>
                    <td style="text-align: center">${localidad.provinciaNombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="ModalEditar(${localidad.localidadID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarLocalidad(${localidad.localidadID})">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
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
                text: "Disculpe, existió un problema al cargar las localidades",
              });
        }
    });
}

function GuardarLocalidad() {
    $("#NombreError").html("");
    $("#ProvinciaError").html("");

    let localidadID = $("#LocalidadID").val();
    let provinciaID = $("#ProvinciaID").val();
    let nombre = $("#Nombre").val().trim();
    let codigoPostal = $("#CP").val().trim();

    let registrado = true;

    if (nombre == "") {
        $("#NombreError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese un nombre de localidad.")
        registrado = false;
    }
    if (provinciaID == 0) {
        $("#ProvinciaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese una provincia.");
        registrado = false;
    }

    if (registrado) {
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
                ListadoLocalidades();
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
                    text: "Disculpe, existió un problema al guardar la localidad",
                  });
                
            }
        });
    }
        // Estilos CSS para el toast
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 600px) {
                .swal2-toast {
                    width: 100% !important; 
                    left: 0 !important; 
                    right: 0 !important; 
                    margin: 0; 
                }
            }
        `;
        document.head.appendChild(style);
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
        success: function (localidadesMostrar) {
            let listadoLocalidad = localidadesMostrar[0];

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




function EliminarLocalidad(localidadID) {
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

                    ListadoLocalidades()
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
                        text: "Disculpe, existió un problema al eliminar la localidad.",
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
                text: "La localidad ha sido eliminada.",
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