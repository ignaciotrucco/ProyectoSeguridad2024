window.onload = HistorialFichajes();

function HistorialFichajes() {

    let personaID = $("#PersonaID").val()

    $.ajax({
        // la URL para la petición
        url: '../../Fichaje/HistorialFichajes',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { PersonaID: personaID },        
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaTurnoLaboral) {



            let contenidoTabla = ``;

            $.each(VistaTurnoLaboral, function (index, persona) {

                
                contenidoTabla += `
                    <tr>
                        <td style="text-align: center"><b>${persona.nombreEmpleado}</b></td>
                        <td style="text-align: center"></td>
                        <td style="text-align: center"></td>
                        <td style="text-align: center"></td>
                    </tr>
                `;

                $.each(persona.vistaTurnosLaborales, function (index, turno) {

                    if (turno.estado == true) {
                        contenidoTabla += `
                        <tr>
                            <td style="text-align: center"></td>
                            <td style="text-align: center">${turno.jornada}</td>
                            <td style="text-align: center">${turno.momentoString}</td>
                            <td style="text-align: center">${turno.fechaFichajeString}</td>
                        </tr>
                    `;
                    }
                    else {
                        contenidoTabla += `
                        <tr class="bg-danger p-2" style="--bs-bg-opacity: .5;">
                            <td style="text-align: center"></td>
                            <td style="text-align: center">${turno.jornada}</td>
                            <td style="text-align: center">${turno.momentoString}</td>
                            <td style="text-align: center">${turno.fechaFichajeString}</td>
                        </tr>
                    `;
                    }
                    
    
                    
    
                 });

             });

            // $.each(mostrarFichajes, function (index, turno) {

            //     if (turno.estado == true) {
            //         contenidoTabla += `
            //     <tr>
            //         <td style="text-align: center">${turno.nombreEmpleado}</td>
            //         <td style="text-align: center">${turno.jornada}</td>
            //         <td style="text-align: center">${turno.momentoString}</td>
            //         <td style="text-align: center">${turno.fechaFichajeString}</td>
            //     </tr>
            //  `;
            //     }
            //     else {
            //         contenidoTabla += `
            //     <tr class="bg-danger p-2" style="--bs-bg-opacity: .5;">
            //         <td style="text-align: center">${turno.nombreEmpleado}</td>
            //         <td style="text-align: center">${turno.jornada}</td>
            //         <td style="text-align: center">${turno.momentoString}</td>
            //         <td style="text-align: center">${turno.fechaFichajeString}</td>
            //     </tr>
            //  `;
            //     }

            // });

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
                text: "Disculpe, existió un problema al cargar los fichajes",
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
        success: function (mensaje) {
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });

            if (mensaje.includes("correctamente")) {
                Toast.fire({
                    icon: "success",
                    title: mensaje,
                    background: '#e0f7fa',
                });
            } else {
                Toast.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: mensaje,
                    background: '#fcffe7',
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error al registrar el fichaje: " + error,
            });
        }
    });
}