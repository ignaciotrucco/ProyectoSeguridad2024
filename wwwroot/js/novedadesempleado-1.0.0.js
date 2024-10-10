window.onload = VistaNovedad();

function MostrarImagenSeleccionada(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var fileName = input.files[0].name; // Obtener el nombre del archivo

        reader.onload = function (e) {
            // Mostrar la imagen en un elemento HTML
            $('#vistaImg').html('<img src="' + e.target.result + '" alt="Imagen seleccionada" width="200" style="cursor: pointer; box-shadow: 2px 2px 2px grey" />');
            
            // Añadir evento para abrir el modal al hacer clic
            $('#vistaImg img').on('click', function () {
                $('#imagenGrande').attr('src', e.target.result);
                $('#modalImagenGrande').show();
            });

            // Mostrar el nombre del archivo
            $('#fileName').text(fileName); // Asegúrate de tener un elemento con ID "fileName"
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        $('#vistaImg').html('');
        $('#fileName').text(''); // Limpiar el nombre si no hay archivo
    }
}


function cerrarModalImagen() {
    $('#modalImagenGrande').hide();
}

function VistaNovedad() {

    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();

    $.ajax({
        // la URL para la petición
        url: '../../NovedadesEmpleado/Novedades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {FechaDesde: fechaDesde, FechaHasta: fechaHasta },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (VistaNovedad) {


            let contenidoTabla = ``;

            $.each(VistaNovedad, function (index, novedad) {


                contenidoTabla += `
            <tr>
                <td style="text-align: left"><i class="fa-solid fa-user"></i>   ${novedad.personaNombre}</td>
            </tr>
            <tr>
                <td style="text-align: left"><i class="fa-solid fa-map-pin"></i>   ${novedad.empresaNombre}</td>
                <td style="text-align: right !important; padding-right: 5px">
                    <button type="button" class="btn btn-dark" onclick="DetalleNovedad(${novedad.novedadID})">Detalle</button>
                </td>
            </tr>
            <tr>
                <td style="text-align: left"><i class="fa-regular fa-calendar-days"></i>   ${novedad.fechaHora}</td>
            </tr>
            <tr>
                <td colspan="3" style="padding: 0;">
                    <hr style="width: 100%;">
                </td>
            </tr>
             `;
            });

            document.getElementById("vistaNovedades").innerHTML = contenidoTabla;

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
                text: "Disculpe, existió un problema al cargar las novedades",
              });
        }
    });
}

function GuardarNovedad() {
    $("#empresaError").html("");
    $("#fechaError").html("")
    $("#observacionError").html("");

    let novedadID = $("#NovedadID").val();
    let empresaID = $("#EmpresaID").val();
    let fechaHora = $("#FechaNovedad").val();
    let observacion = $("#Observacion").val(); 
    let archivo = $("#ImgNovedad")[0].files[0]; // Obtener el archivo

    let guardado = true;

    if (empresaID == 0) {
        $("#empresaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Empresa requerida.");
        guardado = false
    }

    if (fechaHora == "") {
        $("#fechaError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Fecha y hora requerida.");
        guardado = false
    }

    if (observacion == "") {
        $("#observacionError").html('<i class="fa-solid fa-triangle-exclamation"></i>' + "  Debe cargar una observación.");
        guardado = false
    }


    // Crear un objeto FormData
    let formData = new FormData();
    formData.append("NovedadID", novedadID);
    formData.append("EmpresaID", empresaID);
    formData.append("Fecha_Hora", fechaHora);
    formData.append("Observacion", observacion);

    // Solo añadir el archivo si el usuario lo seleccionó
    if (archivo) {
        formData.append("Archivo", archivo);
    }

    if (guardado) {

        $.ajax({
            url: '../../NovedadesEmpleado/CargarNovedad',
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
    
                setTimeout(() => location.href = '../NovedadesEmpleado/NovedadesEmpleado', 1200);
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
                    text: "Disculpe, existió un problema al guardar la novedad",
                });
            }
        });

    }
}

function DetalleNovedad(novedadID) {
    console.log(novedadID);
    $.ajax({
        url: '../../NovedadesEmpleado/Novedades',
        data: { NovedadID: novedadID },
        type: 'POST',
        dataType: 'json',
        success: function (VistaNovedad) {
            let novedadVista = VistaNovedad[0];
            
            $('#novedad').val(novedadID);
            $('#empleado').text('Empleado: ' + novedadVista.personaNombre);
            $('#empresa').text('Cliente: ' + novedadVista.empresaNombre);
            $('#fechaHora').text('Fecha y Hora: ' + novedadVista.fechaHora);
            $('#observacion').text('Observación: ' + novedadVista.observacion);
            
            // Mostrar la imagen si está disponible
            let imagenHtml = '';
            if (novedadVista.nombreArchivo) {
                imagenHtml = `
                        <img title="Expandir" src="data:${novedadVista.contentType};base64,${novedadVista.nombreArchivo}" 
                         style="width: 230px; height: 180px; cursor: pointer; justify-content:center !important; box-shadow: 2px 2px 2px grey"" 
                         onclick="mostrarImagenGrande(this.src)" id="miImagen" />
                        <button class="btn btn-dark" title="Descargar" onclick="descargarImagen('${novedadVista.contentType}', '${novedadVista.nombreArchivo}')"><i class="fa-solid fa-file-arrow-down"></i>
                        </button>
                `;
            } else {
                imagenHtml = '<p>No hay imagen disponible.</p>';
            }

            $('#archivo').html(imagenHtml);
            $('#modalDetalles').show();
        },
        error: function (xhr, status) {
            alert('Error al cargar los datos.');
        }
    });
}

// Función para descargar la imagen
function descargarImagen(contentType, base64String) {
    const enlace = document.createElement('a');
    enlace.href = `data:${contentType};base64,${base64String}`;
    enlace.download = 'novedad.png'; 

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}


function mostrarImagenGrande(src) {
    $('#imagenGrande').attr('src', src);
    $('#modalImagenGrande').show();
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



// function readURL(input) {
//     if (input.files && input.files[0]) {
//       var reader = new FileReader();
//       reader.onload = function (e) {
//         // Actualiza la previsualizacion del archivo
//         var previewElement = document.getElementById('filePreview');
//         previewElement.src = e.target.result;
//         previewElement.style.display = 'block';
//       };
//       reader.readAsDataURL(input.files[0]);
//     }
//   }
  
//   function submitFiles() {
//     try {
//       var personaEmisorID = 1; // Reemplaza con el valor apropiado
//       var personaReceptorID = 2; // Reemplaza con el valor apropiado
  
//       var singleFileUpload = document.getElementById('singleFileUpload');
//       var multipleFileUpload = document.getElementById('multipleFileUpload');
  
//       var singleFile = null;
//       var multipleFiles = [];
  
//       if (singleFileUpload && singleFileUpload.files && singleFileUpload.files.length > 0) {
//         singleFile = singleFileUpload.files[0];
//       } else {
//         console.log('No se seleccionó un archivo individual');
//         // Puedes decidir si continuar o no con la carga de archivos múltiples
//       }
  
//       if (multipleFileUpload && multipleFileUpload.files && multipleFileUpload.files.length > 0) {
//         multipleFiles = Array.from(multipleFileUpload.files);
//       } else {
//         console.log('No se seleccionaron archivos múltiples');
//         // Puedes decidir si continuar o no con la carga del archivo individual
//       }
  
//       var formData = new FormData();
//       if (singleFile) {
//         formData.append('archivo', singleFile);
//       }
//       for (var i = 0; i < multipleFiles.length; i++) {
//         formData.append('archivo', multipleFiles[i]);
//       }
  
//       fetch('/Archivo/GuardarArchivo?personaEmisorID=' + personaEmisorID + '&personaReceptorID=' + personaReceptorID, {
//         method: 'POST',
//         body: formData
//       })
//       .then(response => response.json())
//       .then(data => {
//         if (data.success) {
//           // Archivo guardado exitosamente
//           console.log(data.message);
//           // Ocultar la previsualizacion del archivo
//           var previewElement = document.getElementById('filePreview');
//           previewElement.style.display = 'none';
//         } else {
//           // Ocurrió un error al guardar el archivo
//           console.error(data.message);
//         }
//       })
//       .catch(error => {
//         // Manejar cualquier error
//         console.error('Error al enviar los archivos:', error);
//       });
//     } catch (error) {
//       console.error('Error inesperado:', error);
//       // Mostrar un mensaje de error al usuario o realizar otras acciones de manejo de errores
//     }
//   }

//   function previewFile(fileId, contentType) {
//             var previewElement = document.getElementById(`file-preview-${fileId}`);
//             previewElement.innerHTML = "Cargando vista previa...";

//             fetch(`@Url.Action("VisualizarArchivo", "Archivo", new { id = "FILE_ID" }`.replace("FILE_ID", fileId))
//                 .then(response => response.blob())
//                 .then(blob => {
//                     var objectUrl = URL.createObjectURL(blob);

//                     if (contentType.startsWith("image/")) {
//                         // Mostrar la imagen
//                         var img = document.createElement("img");
//                         img.src = objectUrl;
//                         img.style.maxWidth = "100%";
//                         previewElement.innerHTML = "";
//                         previewElement.appendChild(img);
//                     } else if (contentType.startsWith("application/pdf")) {
//                         // Mostrar el PDF
//                         var iframe = document.createElement("iframe");
//                         iframe.src = objectUrl;
//                         iframe.style.width = "100%";
//                         iframe.style.height = "500px";
//                         previewElement.innerHTML = "";
//                         previewElement.appendChild(iframe);
//                     } else {
//                         // Mostrar un mensaje de error o una vista genérica
//                         previewElement.innerHTML = "No se puede previsualizar este tipo de archivo.";
//                     }
//                 })
//                 .catch(error => {
//                     previewElement.innerHTML = "Error al cargar la vista previa.";
//                     console.error(error);
//                 });
//         }


//         function ListadoNovedades() {
//             $.ajax({
//                 url: '../../NovedadesEmpleado/ListadoNovedades',
//                 data: {},
//                 type: 'POST',
//                 dataType: 'json',
//                 success: function (listadoNovedades) {
//                     LimpiarModal();
        
//                     let contenidoTabla = '';
        
//                     $.each(listadoNovedades, function (index, archivo) {
//                         contenidoTabla += `
//                         <tr>
//                             <td style="text-align: center">${archivo.NombreArchivo}</td>
//                             <td style="text-align: right">
//                                 <button type="button" class="btn" title="Eliminar" onclick="EliminarArchivo(${archivo.ArchivoID})">
//                                     <i class="fa-solid fa-trash" width="20" height="20"></i>
//                                 </button>
//                             </td>
//                         </tr>
//                         `;
//                     });
        
//                     $('#tbody-novedades').html(contenidoTabla);
//                 },
//                 error: function (xhr, status) {
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: "Disculpe, existió un problema al cargar el listado",
//                     });
//                 }
//             });
//         }