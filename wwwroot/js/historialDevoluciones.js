window.onload = HistorialDevoluciones();

function HistorialDevoluciones() {

    $.ajax({
        async: false,
        // la URL para la petición
        url: '../../Devoluciones/ListadoHistorialDevoluciones',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaClienteDevolucion) {


            let contenidoTabla = ``;

            $.each(VistaClienteDevolucion, function (index, devolucion) {


                contenidoTabla += `
                                <tr>
                                    <td class="text-center">${devolucion.clienteNombre}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                             `;

                $.each(devolucion.vistaDevolucion, function (index, vistaDevolucion) {

                    contenidoTabla += `
                                <tr>
                                <td></td>
                                    <td class="text-center">${vistaDevolucion.fechaHora}</td>
                                    <td class="text-center">${vistaDevolucion.reseña}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-dark" onclick="VerEncuesta(${vistaDevolucion.devolucionID})">VER</button>
                                    </td>
                                </tr>
                                `;

                });
            });

            document.getElementById("tbody-historialDevoluciones").innerHTML = contenidoTabla;

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

// function VerEncuesta(devolucionID) {
//     $.ajax({
//         async: false,
//         // la URL para la petición
//         url: '../../Devoluciones/ListadoHistorialDevoluciones',
//         // la información a enviar
//         data: { DevolucionID: devolucionID },
//         // especifica si será una petición POST o GET
//         type: 'POST',
//         // el tipo de información que se espera de respuesta
//         dataType: 'json',
//         // código a ejecutar si la petición es satisfactoria
//         success: function (VistaClienteDevolucion) {
//             let vista = vistaDevolucion[0]

//             $('#devolucion').val(devolucionID);
            

//             // Asumiendo que 'vista.encuesta' es un string delimitado por comas
//             let encuestasArray = vista.encuesta.split(','); // Cambia ',' por el delimitador correcto
//             let encuestaHTML = '';

//             // Itera sobre el array de encuestas para crear una lista
//             encuestasArray.forEach(function (encuesta) {
//                 // Reemplaza comillas dobles y elimina espacios al principio y al final
//                 let respuestaLimpia = encuesta.replace(/["{}]/g, '  ').trim();
//                 if (respuestaLimpia) { // Verifica que la respuesta no esté vacía
//                     encuestaHTML += '<li>' + respuestaLimpia + '</li>'; // Agrega la respuesta a la lista
//                 }
//             });

//             // Agrega la lista de encuestas al contenedor
//             $('#listaEncuestas').html(encuestaHTML); // Asegúrate de tener un contenedor para esto

//             $('#modalDetalles').show();
//         },
//         // código a ejecutar si la petición falla
//         error: function (xhr, status) {
//             const Toast = Swal.mixin({
//                 toast: true,
//                 position: "bottom-end",
//                 showConfirmButton: false,
//                 timer: 3000,
//                 timerProgressBar: true,
//                 background: '#ffe7e7',
//                 didOpen: (toast) => {
//                     toast.onmouseenter = Swal.stopTimer;
//                     toast.onmouseleave = Swal.resumeTimer;
//                 }
//             });
//             Toast.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: "Disculpe, existió un problema al cargar las devoluciones",
//             });
//         }
//     });
// }




// function cerrarModal() {
//     $('#modalDetalles').hide();
// }


// function cerrarModal() {
//     // Oculta el modal
//     document.getElementById('modalDetalles').style.display = "none";
// }

// // Cierra el modal al hacer clic fuera de él
// window.onclick = function (event) {
//     const modal = document.getElementById('modalDetalles');
//     if (event.target === modal) {
//         cerrarModal();
//     }
// }