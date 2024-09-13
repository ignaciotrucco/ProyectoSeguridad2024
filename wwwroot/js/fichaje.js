window.onload = HistorialFichajes();

function HistorialFichajes() {
    $.ajax({
        // la URL para la petición
        url: '../../Fichaje/HistorialFichajes',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoFichajes) {

        

            let contenidoTabla = ``;

            $.each(listadoFichajes, function (index, turno) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${turno.turnoLaboralID}</td>
                    <td style="text-align: center">${turno.usuarioID}</td>
                    <td style="text-align: center">${turno.jornadaLaboralID}</td>
                    <td style="text-align: center">${turno.fechaFichaje}</td>
                    <td style="text-align: center">${turno.momento}</td>
                    <td style="text-align: center">${turno.latitud}</td>
                    <td style="text-align: center">${turno.longitud}</td>
                    <td style="text-align: center">${turno.estado}</td>
                </tr>
             `;
            });

            document.getElementById("tbody-jornadaHistorial").innerHTML = contenidoTabla;

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
                text: "Disculpe, existió un problema al cargar las empresas",
            });
        }
    });
}

function RegistrarMomento(momento) {
    $.ajax({
        url: '/Fichaje/RegistrarMomento',
        type: 'POST',
        data: {
            Momento: momento
        },
        success: function (resupuesta) {
            alert(resupuesta.mensaje);
        },
        error: function (xhr, status, error) {
            alert("Error al registrar el fichaje: " + error);
        }
    });

}