window.onload = ListadoEmpresas();

function NuevoRegistro() {
    $("#tituloModal").text("Nueva Empresa")
}

function LimpiarModal() {
    $("#EmpresaID").val(0);
    $("#RazonSocial").val("");
    $("#Cuit").val("");
    $("#telefono").val("");
    $("#email").val("");
    $("#ProvinciaID").val(0);
    $("#LocalidadID").val(0);
    $("#domicilio").val("");
    $("#UsuarioID").val("");
}

$('#ProvinciaID').change(function () {
    var provinciaId = $(this).val();
    if (provinciaId) {
        $.ajax({
            url: '../../Personas/GetLocalidades',
            type: 'GET',
            data: { provinciaId: provinciaId },
            success: function (data) {
                var localidadDropdown = $('#LocalidadID');
                localidadDropdown.empty();
                localidadDropdown.append('<option value="">Seleccione una localidad</option>');
                $.each(data, function (index, item) {
                    localidadDropdown.append('<option value="' + item.localidadID + '">' + item.nombre + '</option>');
                });
            }
        });
    } else {
        $('#LocalidadID').empty();
        $('#LocalidadID').append('<option value="">Seleccione una localidad</option>');
    }
});

function ListadoEmpresas() {
    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (mostrarEmpresa) {

            $("#modalEmpresas").modal("hide");
            LimpiarModal()

            let contenidoTabla = ``;

            $.each(mostrarEmpresa, function (index, empresa) {

                contenidoTabla += `
                <tr>
                    <td style="text-align: center">${empresa.razonSocial}</td>
                    <td style="text-align: center">${empresa.cuit_Cdi}</td>
                    <td style="text-align: center">${empresa.telefono}</td>
                    <td style="text-align: center">${empresa.email}</td>
                    <td style="text-align: center">${empresa.provinciaNombre}</td>
                    <td style="text-align: center">${empresa.localidadNombre}</td>
                    <td style="text-align: center">${empresa.domicilio}</td>
                    <td style="text-align: right">
                    <button type="button" class="btn" title="Editar" onclick="AbrirModalEditar(${empresa.empresaID})">
                    <i class="fa-solid fa-pen-to-square" width="20" height="20"></i>
                    </button>
                    </td>
                    <td style="text-align: left">
                    <button type="button" class="btn" title="Eliminar" onclick="">
                    <i class="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-empresas").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}

function GuardarEmpresa() {

    let empresaID = $("#EmpresaID").val();
    let razonSocial = $("#RazonSocial").val();
    let cuit = $("#Cuit").val();
    let telefono = $("#telefono").val();
    let email = $("#email").val();
    let localidadID = $("#LocalidadID").val();
    let domicilio = $("#domicilio").val();
    let usuarioID = $("#UsuarioID").val();


    $.ajax({
        url: '../../Empresas/GuardarEmpresas',
        data: {
            EmpresaID: empresaID,
            LocalidadID: localidadID,
            UsuarioID: usuarioID,
            RazonSocial: razonSocial,
            Cuit_Cdi: cuit,
            Telefono: telefono,
            Email: email,
            Domicilio: domicilio
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            
            if (resultado != "") {
                Swal.fire(resultado);
            }
            ListadoEmpresas();

        },
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al guardar la empresa",
            });
        }
    });

}

function AbrirModalEditar(empresaID) {
    console.log(empresaID);
    $.ajax({
        // la URL para la petición
        url: '../../Empresas/ListadoEmpresas',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (mostrarEmpresa) {
            let mostrarEmpresas = mostrarEmpresa[0];
            
            $("#EmpresaID").val(mostrarEmpresas.empresaID);
            $("#RazonSocial").val(mostrarEmpresas.razonSocial);
            $("#Cuit").val(mostrarEmpresas.cuit_Cdi);
            $("#telefono").val(mostrarEmpresas.telefono);
            $("#email").val(mostrarEmpresas.email);
            $("#ProvinciaID").val(mostrarEmpresas.provinciaID);
            $("#LocalidadID").val(mostrarEmpresas.localidadID);
            $("#domicilio").val(mostrarEmpresas.domicilio);
            $("#UsuarioID").val(mostrarEmpresas.usuarioID);
            $("#modalEmpresas").modal("show");
            $("#tituloModal").text("Editar Empresa");
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Disculpe, existió un problema al cargar el listado",
            });
        }
    });
}