window.onload = VistaDevolucion();

function VistaDevolucion() {

    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();

    $.ajax({
        // la URL para la petición
        url: '../../Devoluciones/Devolucion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { FechaDesde: fechaDesde, FechaHasta: fechaHasta },
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
                <td style="text-align: left"><i class="fa-solid fa-users"></i>   ${devolucion.clienteNombre}</td>
            </tr>
            <tr>
                <td style="text-align: right !important; padding-right: 5px">
                    <button type="button" class="btn btn-dark" onclick="DetalleDevolucion(${devolucion.devolucionID})">Detalle</button>
                </td>
            </tr>
            <tr>
                <td style="text-align: left"><i class="fa-solid fa-calendar-days"></i>   ${devolucion.fechaHora}</td>
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
    let resenia = $("#Resenia").val();

    // Crear un objeto que contenga las respuestas de la encuesta
    let encuesta = {
        "¿Qué tan satisfecho estás con la calidad general de nuestros servicios de seguridad?": $("input[name='satisfaccion']:checked").val(),
        "¿Cómo calificarías la profesionalidad del personal de seguridad asignado a tu propiedad?": $("input[name='profesionalidad']:checked").val(),
        "¿Los guardias de seguridad se muestran atentos y receptivos a tus necesidades?": $("input[name='atencion']:checked").val(),
        "¿El personal de seguridad cumple con los horarios establecidos?": $("input[name='horarios']:checked").val(),
        "¿Te sientes seguro con las medidas de seguridad implementadas por nuestra empresa?": $("input[name='seguridad']:checked").val(),
        "¿Recomendarías nuestros servicios de seguridad a otras empresas o personas?": $("input[name='recomendacion']:checked").val(),
    };

    // Convertir el objeto de la encuesta a formato JSON
    let encuestaString = JSON.stringify(encuesta);
    let guardado = true;

    $("#encuestaError").html("");
    $("#comentarioError").html("");

    if (!encuesta["¿Qué tan satisfecho estás con la calidad general de nuestros servicios de seguridad?"]) {
        $("#encuestaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Debes completar la encuesta.");
        guardado = false;
    }

    if (resenia == "") {
        $("#comentarioError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Debe cargar un comentario.");
        guardado = false;
    }

    if (!guardado) {
        return;
    }

    $.ajax({
        url: '../../Devoluciones/CargarObservacion',
        type: 'POST',
        data: { DevolucionID: devolucionID, Resenia: resenia, Encuesta: encuestaString },
        success: function (response) {
            if (response.success) {
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
                    title: response.resultado,
                });
                setTimeout(() => {
                    location.href = '../Devoluciones/Devoluciones';
                }, 1200);
            } else {
                $("#comentarioError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + response.resultado);
            }
        },
        error: function (xhr, status) {
            console.log('Error al guardar la devolución:', status);
        }
    });
}



function DetalleDevolucion(devolucionID) {

    $.ajax({
        // la URL para la petición
        url: '../../Devoluciones/Devolucion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { DevolucionID: devolucionID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaDevolucion) {

            let vista = VistaDevolucion[0]

            $('#devolucion').val(devolucionID);
            $('#cliente').text('Cliente: ' + vista.clienteNombre);
            $('#fechaHora').text('Fecha y Hora: ' + vista.fechaHora);
            $('#comentario').text('Comentario: ' + vista.reseña);

            //ENCUESTA ES UN STRING DELIMITADO CON COMAS ENTONCES LO CAMBIAMOS POR EL DELIMITADOR CORRECTO
            let encuestasArray = vista.encuesta.split(',');
            let encuestaHTML = '';

            //RECORRE EL ARRAY ENCUESTAS PARA CREAR UNA LISTA
            encuestasArray.forEach(function (encuesta) {
                //REEMPLAZA COMILLAS DOBLES Y ELIMINA ESPACIOS AL PRINCIPIO Y FINAL 
                let respuestaLimpia = encuesta.replace(/["{}]/g, '  ').trim();
                if (respuestaLimpia) { //VERIFICA QUE LA RESPUESTA NO ESTE VACIA
                    encuestaHTML += '<li>' + respuestaLimpia + '</li>'; //SI NO ES VACIA LA AGREGA A LA LISTA
                }
            });

            //AGREGA LA LISTA DE ENCUESTAS AL CONTENEDOR
            $('#listaEncuestas').html(encuestaHTML);

            $('#modalDetalles').show();

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

function cerrarModal() {
    $('#modalDetalles').hide();
}


function cerrarModal() {
    // Oculta el modal
    document.getElementById('modalDetalles').style.display = "none";
}

// Cierra el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('modalDetalles');
    if (event.target === modal) {
        cerrarModal();
    }
}