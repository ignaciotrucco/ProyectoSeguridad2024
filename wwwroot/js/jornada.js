window.onload = ListadoJornadas();

// Obtenemos el checkbox principal, el contenedor de los checkboxes adicionales y el campo de fecha especial
const checkboxPrincipal = document.getElementById('checkboxPrincipal');
const checkboxsAdicionales = document.getElementById('checkboxsAdicionales');
const fechaEspecial = document.getElementById('fechaEspecial');

// Añadimos un evento para detectar cambios en el checkbox principal
checkboxPrincipal.addEventListener('change', function () {
    // Si el checkbox principal está seleccionado, mostramos los checkboxes adicionales y ocultamos la fecha especial
    if (this.checked) {
        checkboxsAdicionales.style.display = 'block';
        fechaEspecial.style.display = 'none';
    } else {
        // Si no está seleccionado, mostramos la fecha especial y ocultamos los checkboxes adicionales
        checkboxsAdicionales.style.display = 'none';
        fechaEspecial.style.display = 'block';
    }
    // Limpiamos los checkboxes adicionales cuando se cambia el estado del principal
    const checkboxes = checkboxsAdicionales.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    // Limpiamos el campo de fecha especial cuando se cambia el estado del checkbox principal
    fechaEspecialInput.value = '';
});

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Jornada")
}

function LimpiarModalJornada() {
    $("#JornadaID").val(0);
    $("#EmpresaID").val(0);
    $("#Lugar").val("");
    $("#checkboxPrincipal").prop("checked", false); // Desmarca el checkbox principal
    $("#fechaEspecialInput").val(""); // Limpia el campo de fecha especial
    $("#fechaEspecial").show();
    $("#lunes").prop("checked", false); // Desmarca el checkbox de lunes
    $("#martes").prop("checked", false); // Desmarca el checkbox de martes
    $("#miercoles").prop("checked", false); // Desmarca el checkbox de miércoles
    $("#jueves").prop("checked", false); // Desmarca el checkbox de jueves
    $("#viernes").prop("checked", false); // Desmarca el checkbox de viernes
    $("#sabado").prop("checked", false); // Desmarca el checkbox de sábado
    $("#domingo").prop("checked", false); // Desmarca el checkbox de domingo
    $("#HsEntrada").val(""); // Limpia el campo de hora de entrada
    $("#HsSalida").val(""); // Limpia el campo de hora de salida
    $("#checkboxsAdicionales").hide();
}


function ListadoJornadas() {

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/ListadoJornadas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'DELETE',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoJornadas) {

            $("#modalJornada").modal("hide");
            LimpiarModalJornada();

            let contenidoTabla = ``;

            $.each(listadoJornadas, function (index, jornada) {

                let diasColumna;

                //DETERMINA QUE VALOR MOSTRAR EN LA COLUMNA DIAS
                if (jornada.dia) {
                    diasColumna = jornada.diasSemana;
                }
                else {
                    diasColumna = jornada.diaEspecialString;
                }

                contenidoTabla += `
    <tr>
        <td style="text-align: center">${jornada.nombreEmpresa}</td>
        <td style="text-align: center">${jornada.lugar}</td>
        <td style="text-align: center">${diasColumna}</td>
        <td style="text-align: center">${jornada.horarioEntradaString}</td>
        <td style="text-align: center">${jornada.horarioSalidaString}</td>
        <td style="text-align: right">
        <button type="button" class="btn" title="Editar" onclick="ModalEditar(${jornada.jornadaLaboralID})">
        <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
        </button>
        </td>
        <td style="text-align: left">
        <button type="button" class="btn" title="Eliminar" onclick="EliminarJornadaLaboral(${jornada.jornadaLaboralID})">
        <i class="fa-solid fa-trash" width="20" height="20"></i>
        </button>
        </td>
    </tr>
 `;
            });

            document.getElementById("tbody-jornadalaboral").innerHTML = contenidoTabla;


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

function GuardarJornadaLaboral() {
    let empresa = $("#EmpresaID").val();
    let lugar = $("#Lugar").val();
    let dia = $("#checkboxPrincipal").is(":checked"); // Convertir a booleano
    let diaEspecial = dia ? null : $("#fechaEspecialInput").val(); // Null si Dia es true
    let lunes = $("#lunes").is(":checked");
    let martes = $("#martes").is(":checked");
    let miercoles = $("#miercoles").is(":checked");
    let jueves = $("#jueves").is(":checked");
    let viernes = $("#viernes").is(":checked");
    let sabado = $("#sabado").is(":checked");
    let domingo = $("#domingo").is(":checked");
    let horaEntrada = $("#HsEntrada").val();
    let horaSalida = $("#HsSalida").val();

    $.ajax({
        url: '../../JornadaLaboral/GuardarJornadaLaboral',
        data: {
            EmpresaID: empresa,
            Lugar: lugar,
            Dia: dia,
            DiaEspecial: diaEspecial,
            Lunes: lunes,
            Martes: martes,
            Miercoles: miercoles,
            Jueves: jueves,
            Viernes: viernes,
            Sabado: sabado,
            Domingo: domingo,
            HorarioEntrada: horaEntrada,
            HorarioSalida: horaSalida
        },
        type: 'POST',
        dataType: 'json',
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

            ListadoJornadas();
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
                text: "Disculpe, existió un problema al cargar las localidades",
            });
        }
    });
}

function ModalEditar(jornadaLaboralID) {

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/ListadoJornadas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { JornadaLaboralID: jornadaLaboralID },
        // especifica si será una petición POST o GET
        type: 'DELETE',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoJornadas) {

            let listadoJornada = listadoJornadas[0];

            $("#JornadaID").val(jornadaLaboralID);
            $("#tituloModal").text("Editar Jornada")
            $("#EmpresaID").val(listadoJornada.empresaID);
            $("#Lugar").val(listadoJornada.lugar);
            $("#HsEntrada").val(listadoJornada.HorarioEntradaString);
            $("#HsSalida").val(listadoJornada.HorarioSalidaString);
            $("#fechaEspecialInput").val(listadoJornada.DiaEspecialString);
            document.getElementById("checkboxPrincipal").checked = listadoJornada.dia
            document.getElementById("lunes").checked = listadoJornada.lunes;
            document.getElementById("martes").checked = listadoJornada.martes;
            document.getElementById("miercoles").checked = listadoJornada.miercoles;
            document.getElementById("jueves").checked = listadoJornada.jueves;
            document.getElementById("viernes").checked = listadoJornada.viernes;
            document.getElementById("sabado").checked = listadoJornada.sabado;
            document.getElementById("domingo").checked = listadoJornada.domingo;
            $("#modalJornada").modal("show");

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

function EliminarJornadaLaboral(jornadaLaboralID) {
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
                url: '../../JornadaLaboral/EliminarJornadaLaboral',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { JornadaLaboralID: jornadaLaboralID },
                // especifica si será una petición POST o GET
                type: 'POST',
                // el tipo de información que se espera de respuesta
                dataType: 'json',
                // código a ejecutar si la petición es satisfactoria;
                // la respuesta es pasada como argumento a la función
                success: function (eliminarJornada) {

                    // if (!resultado) {
                    // const Toast = Swal.mixin({
                    //     toast: true,
                    //     position: "bottom-end",
                    //     showConfirmButton: false,
                    //     timer: 3000,
                    //     timerProgressBar: true,
                    //     background: '#fcffe7',
                    //     didOpen: (toast) => {
                    //       toast.onmouseenter = Swal.stopTimer;
                    //       toast.onmouseleave = Swal.resumeTimer;
                    //     }
                    //   });
                    //   Toast.fire({
                    //     icon: "warning",
                    //     title: "Oops...",
                    //     text: "No se puede eliminar, existen registros asociados",
                    //   });}

                    ListadoJornadas();
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
                        text: "Disculpe, existió un problema al eliminar la persona.",
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
                text: "La persona ha sido eliminada.",
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

function LimpiarModalAsignar() {
    $("#AsignacionJornadaID").val(0);
    $("#PersonaID").val(0);
    $("#JornadaLaboralID").val(0);
}