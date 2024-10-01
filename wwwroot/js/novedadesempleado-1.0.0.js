function Guardar() {
    location.href = `../NovedadesEmpleado/NovedadesEmpleado`;
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