window.onload = VistaDevolucion();

function VistaDevolucion() {

    $.ajax({
        // la URL para la petición
        url: '../../Devoluciones/Devolucion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {  },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaDevolucion) {


            let contenidoTabla = ``;

            $.each(VistaDevolucion, function (index, devolucion) {


                contenidoTabla += `
            <tr>
                <td style="text-align: left">${devolucion.clienteNombre}</td>
            </tr>
            <tr>
                <td style="text-align: left">${devolucion.fechaHora}</td>
            </tr>
            <tr>
                <td style="text-align: left">${devolucion.reseña}</td>
            </tr>
            <tr>
                <td colspan="3" style="padding: 0;">
                    <hr style="width: 100%;">
                </td>
            </tr>
             `;
            });

            document.getElementById("vistaDevoluciones").innerHTML = contenidoTabla;

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
                text: "Disculpe, existió un problema al cargar las devoluciones",
              });
        }
    });
}


function GuardarDevolucion() {
    let devolucionID = $("#DevolucionID").val();
    let fechaHora = $("#FechaDevolucion").val();
    let reseña = $("#Reseña").val(); 

    // Crear un objeto FormData
    let formData = new FormData();
    formData.append("DevolucionID", devolucionID);
    formData.append("Fecha_Hora", fechaHora);
    formData.append("Reseña", reseña);

    $.ajax({
        url: '../../Devoluciones/CargarObservacion',
        type: 'POST',
        data: formData, 
        processData: false, // Impedir que jQuery procese los datos
        contentType: false, // Impedir que jQuery establezca el tipo de contenido
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

            setTimeout(() => location.href = '../Devoluciones/Devoluciones', 1200);
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
                text: "Disculpe, existió un problema al guardar la observacion",
            });
        }
    });
}