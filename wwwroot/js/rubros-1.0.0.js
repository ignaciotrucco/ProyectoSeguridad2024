window.onload = ListadoRubros();

function NuevoRubro() {
    $("#tituloModal").text("Nuevo Rubro");
}

function LimpiarForm() {
    document.getElementById("RubroID").value = 0;
    document.getElementById("NombreRubro").value = "";
    document.getElementById("NombreRubroError").innerHTML = "";
}

// ESCUCHA EL EVENTO 'KEYUP' EN EL CAMPO DE BÚSQUEDA CON ID 'INPUTBUSQUEDA'
// CADA VEZ QUE EL USUARIO ESCRIBE, SE CAPTURA EL VALOR ACTUAL Y SE LLAMA A LA FUNCIÓN LISTADOPERSONAS
// PARA FILTRAR LA LISTA DE PERSONAS SEGÚN EL TEXTO INGRESADO.
$(document).ready(function () {
    $('#inputBusqueda').on('keyup', function () {
        let busqueda = $(this).val();
        ListadoRubros(busqueda);
    });
});

function ListadoRubros(busqueda) {

    $.ajax({
        url: '../../Rubros/ListadoRubros',
        data: { busqueda: busqueda },
        type: 'POST',
        dataType: 'json',
        success: function (listadoRubros) {
            $("#modalRubros").modal("hide");
            LimpiarForm();

            let contenidoTabla = ``;
            $.each(listadoRubros, function (index, rubro) {
                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${rubro.nombre}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="ModalEditar(${rubro.rubroID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="EliminarRubro(${rubro.rubroID})">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-rubros").innerHTML = contenidoTabla;
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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });

}

function GuardarRubro() {

    let rubroID = $("#RubroID").val();
    let nombreRubro = $("#NombreRubro").val();

    $("#NombreRubroError").html("");

    let guardado = true;

    if (nombreRubro == "") {
        $("#NombreRubroError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Ingrese un nombre de rubro.")
        guardado = false;
    }

    if (guardado) {

        $.ajax({
            url: '../../Rubros/GuardarRubro',
            data: {
                RubroID: rubroID,
                NombreRubro: nombreRubro
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
                ListadoRubros();

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
                    text: "Disculpe, existió un problema al guardar",
                });
            }
        });

    }

}

function ModalEditar(rubroID) {

    $("#tituloModal").text("Editar Rubro");

    $.ajax({
        url: '../../Rubros/ListadoRubros',
        data: { RubroID: rubroID },
        type: 'POST',
        dataType: 'json',
        success: function (listadoRubros) {

            let rubrosListado = listadoRubros[0]

            $("#RubroID").val(rubroID)
            $("#NombreRubro").val(rubrosListado.nombre)
            $("#modalRubros").modal("show");


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
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });

}

function EliminarRubro(rubroID) {


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
                url: '../../Rubros/EliminarRubro',
                data: { RubroID: rubroID },
                type: 'POST',
                dataType: 'json',
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
                    ListadoRubros();

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
                        text: "Disculpe, existió un problema al eliminar",
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
                text: "El rubro ha sido eliminado.",
            });
        } else if (
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