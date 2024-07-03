// function ListadoPersonas() {
//     $.ajax({
//         url: '../../Personas/listadoPersonas',
//         data: {},
//         type: 'POST',
//         dataType: 'json',
//         success: function (listadoPersonas) {

//             // $("#modalPersonas").modal("hide");
//             // LimpiarModal()

//             let contenidoCard = ``;

//             $.each(listadoPersonas, function (index, persona) {

//                 contenidoCard += `

//                 <div class="col-md-3">
//                 <div class="card"">
//                      <img src="../img/img_usuario.png" class="card-img-top">
//                 <div class="card-body" id="cbody-personas">
//                      <h5 class="card-title">${persona.nombreCompleto}</h5>
//                      <p class="card-text">${persona.localidadID}</p>
//                      <p class="card-text">${persona.usuarioID}</p>
//                      <p class="card-text">${persona.telefono}</p>
//                      <p class="card-text">${persona.domicilio}</p>
//                      <p class="card-text">${persona.email}</p>
//                      <p class="card-text">${persona.tipoDocumentoID}</p>
//                      <p class="card-text">${persona.numeroDocumento}</p>
//                      </div>
//                    </div>
//                 </div>

//              `;
//             });

//             document.getElementById("cbody-personas").innerHTML = contenidoCard;

//         },
//         error: function (xhr, status) {
//             console.log('Disculpe, existió un problema al cargar el listado');
//         }
//     });
// }