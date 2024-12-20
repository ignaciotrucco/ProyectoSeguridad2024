window.onload = ListadoJornadas();
window.onload = ListadoAsignacion();
window.onload = ListadoJornadasImprimir();
window.onload = ListadoAsignacionImprimir();

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
    document.getElementById("empresaIdError").innerHTML = "";
    document.getElementById("lugarError").innerHTML = "";
    document.getElementById("HsEntradaError").innerHTML = "";
    document.getElementById("HsSalidaError").innerHTML = "";
    document.getElementById("diaError").innerHTML = "";
    document.getElementById("diaEspecialError").innerHTML = "";

}

function ListadoJornadas() {

    let empresaID = $("#EmpresaFiltrar").val();

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/ListadoJornadas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { EmpresaID: empresaID },
        // especifica si será una petición POST o GET
        type: 'GET',
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
        <td style="text-align: center" class="ocultar-en-767px">${jornada.lugar}</td>
        <td style="text-align: center" class="ocultar-en-767px">${diasColumna}</td>
        <td style="text-align: center" class="ocultar-en-767px">${jornada.horarioEntradaString}</td>
        <td style="text-align: center" class="ocultar-en-767px">${jornada.horarioSalidaString}</td>
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
        <td style="text-align: left">
        <button type="button" class="btn mostrar-en-767px" title="Detalles" onclick="mostrarModal1('${jornada.nombreEmpresa}',
        '${jornada.lugar}', '${diasColumna}', '${jornada.horarioEntradaString}','${jornada.horarioSalidaString}')">
        <i class="fa-solid fa-info" width="20" height="20"></i>
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });

}


function ListadoJornadasImprimir() {

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/ListadoJornadas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoJornadas) {


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
        <td style="text-align: center" class="ocultar-en-767px">${jornada.lugar}</td>
        <td style="text-align: center" class="ocultar-en-767px">${diasColumna}</td>
        <td style="text-align: center" class="ocultar-en-767px">${jornada.horarioEntradaString}</td>
        <td style="text-align: center" class="ocultar-en-767px">${jornada.horarioSalidaString}</td>
    </tr>
 `;
            });

            document.getElementById("tbody-jornadalaboralImprimir").innerHTML = contenidoTabla;


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


function GuardarJornadaLaboral() {
    let jornadaLaboralID = $("#JornadaID").val();
    let empresa = $("#EmpresaID").val();
    let lugar = $("#Lugar").val().trim();
    let dia = $("#checkboxPrincipal").is(":checked"); // Convertir a booleano
    let diaEspecial = $("#fechaEspecialInput").val().trim(); // Día especial
    let lunes = $("#lunes").is(":checked");
    let martes = $("#martes").is(":checked");
    let miercoles = $("#miercoles").is(":checked");
    let jueves = $("#jueves").is(":checked");
    let viernes = $("#viernes").is(":checked");
    let sabado = $("#sabado").is(":checked");
    let domingo = $("#domingo").is(":checked");
    let horaEntrada = $("#HsEntrada").val();
    let horaSalida = $("#HsSalida").val();

    let guardado = true;

    // Validación de Empresa
    if (empresa == 0) {
        $("#empresaIdError").html('<i class="fa-solid fa-triangle-exclamation"></i> La empresa es requerida');
        guardado = false;
    }

    // Validación de Lugar
    if (lugar == "") {
        $("#lugarError").html('<i class="fa-solid fa-triangle-exclamation"></i> El lugar es requerido');
        guardado = false;
    }

    // Validación de Horarios
    if (horaEntrada == "") {
        $("#HsEntradaError").html('<i class="fa-solid fa-triangle-exclamation"></i> Requerido');
        guardado = false;
    }
    if (horaSalida == "") {
        $("#HsSalidaError").html('<i class="fa-solid fa-triangle-exclamation"></i> Requerido');
        guardado = false;
    }

    if (dia) {
        if (!(lunes || martes || miercoles || jueves || viernes || sabado || domingo)) {
            $("#diaError").html('<i class="fa-solid fa-triangle-exclamation"></i> Requerido');
            guardado = false;
        } else {
            $("#diaError").html(""); 
        }
    } else {
        if (diaEspecial == "") {
            $("#diaEspecialError").html('<i class="fa-solid fa-triangle-exclamation"></i> Requerido');
            guardado = false;
        } else {
            $("#diaEspecialError").html(""); 
        }
    }

    

    if (guardado) {

        $.ajax({
            url: '../../JornadaLaboral/GuardarJornadaLaboral',
            data: {
                JornadaLaboralID: jornadaLaboralID,
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
                setTimeout(function() {
                    window.location.reload();
                }, 1000); // 1000 milisegundos = 1 segundo                
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
                    text: "Disculpe, existió un problema al cargar la jornada",
                });
            }
        });

    }

}

function ModalEditar(jornadaLaboralID) {
    $("#tituloModal").text("Editar Jornada")
    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/ListadoJornadas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { JornadaLaboralID: jornadaLaboralID },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoJornadas) {

            listadoJornada = listadoJornadas[0];

            $("#JornadaID").val(jornadaLaboralID);
            $("#modalJornada").modal("show");
            $("#EmpresaID").val(listadoJornada.empresaID);
            $("#Lugar").val(listadoJornada.lugar);
            $("#HsEntrada").val(listadoJornada.horarioEntradaString);
            $("#HsSalida").val(listadoJornada.horarioSalidaString);
            document.getElementById("checkboxPrincipal").checked = listadoJornada.dia

            if (listadoJornada.dia == false) {
                var fechaEspecial = new Date(listadoJornada.diaEspecial);
                var fechaFormateada = fechaEspecial.toISOString().split('T')[0]; // Convierte a yyyy-MM-dd
                $("#fechaEspecialInput").val(fechaFormateada);
            }
            else {
                $("#fechaEspecial").hide();
                $("#checkboxsAdicionales").show();
                document.getElementById("lunes").checked = listadoJornada.lunes;
                document.getElementById("martes").checked = listadoJornada.martes;
                document.getElementById("miercoles").checked = listadoJornada.miercoles;
                document.getElementById("jueves").checked = listadoJornada.jueves;
                document.getElementById("viernes").checked = listadoJornada.viernes;
                document.getElementById("sabado").checked = listadoJornada.sabado;
                document.getElementById("domingo").checked = listadoJornada.domingo;
            }


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

                    ListadoJornadas();
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000); // 1000 milisegundos = 1 segundo
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
                        text: "Disculpe, existió un problema al eliminar la jornada.",
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
                text: "La jornada ha sido eliminada.",
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
    document.getElementById("PersonaError").innerHTML = "";
    document.getElementById("JornadaLaboralError").innerHTML = "";
}

function NuevaAsignacion() {
    $("#tituloModalAsignacion").text("Nueva Asignacion")
}

function ListadoAsignacion() {

    let empleado = $("#EmpleadoFiltrar").val();

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/MostrarAsignacion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { Empleado: empleado },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (vistaAsignacion) {

            $("#modalEmpleadoJornada").modal("hide");
            LimpiarModalAsignar();

            let tabla = ``;

            $.each(vistaAsignacion, function (index, asignacion) {

                let diasEnColumna;

                //DETERMINA QUE VALOR MOSTRAR EN LA COLUMNA DIAS
                if (asignacion.dia) {
                    diasEnColumna = asignacion.diasSemana;
                }
                else {
                    diasEnColumna = asignacion.diaEspecialString;
                }

                tabla += `
    <tr>
        <td style="text-align: center">${asignacion.personaNombre}</td>
        <td style="text-align: center" class="ocultar-en-767px">${asignacion.infoJornada}</td>
        <td style="text-align: center" class="ocultar-en-767px">${diasEnColumna}</td>
        <td style="text-align: right">
        <button type="button" class="btn" title="Editar" onclick="ModalEditarAsignacion(${asignacion.asignacionJornadaID})">
        <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
        </button>
        </td>
        <td style="text-align: left">
        <button type="button" class="btn" title="Eliminar" onclick="EliminarAsignacion(${asignacion.asignacionJornadaID})">
        <i class="fa-solid fa-trash" width="20" height="20"></i>
        </button>
        </td>
        <td style="text-align: left">
        <button type="button" class="btn mostrar-en-767px" title="Detalles" onclick="mostrarModal2('${asignacion.personaNombre}',
        '${asignacion.infoJornada}', '${diasEnColumna}')">
        <i class="fa-solid fa-info" width="20" height="20"></i>
        </button>
        </td>
    </tr>
 `;
            });

            document.getElementById("tbody-asignacion").innerHTML = tabla;


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

function ListadoAsignacionImprimir() {

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/MostrarAsignacion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (vistaAsignacion) {


            let tabla = ``;

            $.each(vistaAsignacion, function (index, asignacion) {

                let diasEnColumna;

                //DETERMINA QUE VALOR MOSTRAR EN LA COLUMNA DIAS
                if (asignacion.dia) {
                    diasEnColumna = asignacion.diasSemana;
                }
                else {
                    diasEnColumna = asignacion.diaEspecialString;
                }

                tabla += `
    <tr>
        <td style="text-align: center">${asignacion.personaNombre}</td>
        <td style="text-align: center" class="ocultar-en-767px">${asignacion.infoJornada}</td>
        <td style="text-align: center" class="ocultar-en-767px">${diasEnColumna}</td>
    </tr>
 `;
            });

            document.getElementById("tbody-asignacionImprimir").innerHTML = tabla;


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

function GuardarAsignacion() {
    let asignacionID = $("#AsignacionJornadaID").val();
    let personaID = $("#PersonaID").val();
    let jornadaLaboralID = $("#JornadaLaboralID").val();

    let guardado = true;

    if (personaID == 0) {
        $("#PersonaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La persona es requerida")
        guardado = false;
    }
    if (jornadaLaboralID == 0) {
        $("#JornadaLaboralError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  La jornada es requerida")
        guardado = false;
    }

    if (guardado) {

        $.ajax({
            url: '../../JornadaLaboral/GuardarAsignacion',
            data: {
                AsignacionJornadaID: asignacionID,
                PersonaID: personaID,
                JornadaLaboralID: jornadaLaboralID
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
                ListadoAsignacion();
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
                    text: "Disculpe, existió un problema al guardar la asignación",
                });
            }
        });

    }

}

function ModalEditarAsignacion(asignacionID) {

    $("#tituloModalAsignacion").text("Editar Asignacion");

    $.ajax({
        // la URL para la petición
        url: '../../JornadaLaboral/MostrarAsignacion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { AsignacionJornadaID: asignacionID },
        // especifica si será una petición POST o GET
        type: 'GET',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (vistaAsignacion) {

            let asignacion = vistaAsignacion[0];

            $("#AsignacionJornadaID").val(asignacionID);
            $("#modalEmpleadoJornada").modal("show");
            $("#PersonaID").val(asignacion.personaID);
            $("#JornadaLaboralID").val(asignacion.jornadaLaboralID);


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

function EliminarAsignacion(asignacionID) {
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
                url: '../../JornadaLaboral/EliminarAsignacion',
                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: { AsignacionJornadaID: asignacionID },
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

                    ListadoJornadas();
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000); // 1000 milisegundos = 1 segundo
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
                        text: "Disculpe, existió un problema al eliminar la asignación.",
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
                text: "La asignación ha sido eliminada.",
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
//     var modal = document.getElementById("ModalImpresion");
//     modal.style.display = "block";
// }

// function closeModalImpresion() {
//     var modal = document.getElementById("ModalImpresion");
//     modal.style.display = "none";
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

function openModalInfoTablas2() {
    var modal = document.getElementById("ModalInfoTablas2");
    modal.style.display = "block";
}

function closeModalInfoTablas2() {
    var modal = document.getElementById("ModalInfoTablas2");
    modal.style.display = "none";
}

function handleEntendido() {
    closeModalInfoTablas2();
    // openModalImpresion();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModalInfoTablas2();
    }
});

window.onclick = function (event) {
    var modal = document.getElementById("ModalInfoTablas2");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarModal1(nombreEmpresa, lugar, diasColumna, horarioEntradaString, horarioSalidaString) {
    $('#nombreEmpresa').text('Cliente: ' + nombreEmpresa);
    $('#lugar').text('Lugar: ' + lugar);
    $('#diasColumna').text('Dia / Días: ' + diasColumna);
    $('#horarioEntradaString').text('Horario de entrada: ' + horarioEntradaString);
    $('#horarioSalidaString').text('Horario de salida: ' + horarioSalidaString);
    $('#modalDetalles1').show();
}

function cerrarModal1() {
    // Oculta el modal
    document.getElementById('modalDetalles1').style.display = "none";
}

// Cierra el modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalles1');
    if (event.target === modal) {
        cerrarModal1();
    }
}

function mostrarModal2(personaNombre, infoJornada, diasEnColumna) {
    $('#personaNombre').text('Empleado: ' + personaNombre);
    $('#infoJornada').text('Lugar y Hora: ' + infoJornada);
    $('#diasEnColumna').text('Dia / Días: ' + diasEnColumna);
    $('#modalDetalles2').show();
}

function cerrarModal2() {
    // Oculta el modal
    document.getElementById('modalDetalles2').style.display = "none";
}

// Cierra el modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalles2');
    if (event.target === modal) {
        cerrarModal2();
    }
}