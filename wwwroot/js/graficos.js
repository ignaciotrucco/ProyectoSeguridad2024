window.onload = GraficoCircularEmpresas();
 


let graficoCircularHistorialFichajes;
let graficoCircularEmpresas;

function GraficoCircularEmpresas(){
    $.ajax({
        type: "POST",
        url: '../../Graficos/GraficoTortaEmpresasPorLocalidad',  
        success: function (vistaEmpresasPorLocalidad) {
            console.log(vistaEmpresasPorLocalidad); 
           
            var labels = [];
            var data = [];
            var fondo = [];
            
            // Iteramos sobre los datos devueltos del servidor
            $.each(vistaEmpresasPorLocalidad, function (index, localidad) {
                labels.push(localidad.nombreLocalidad); 
                var color = generarColorAleatorio(); 
                fondo.push(color);
                data.push(localidad.cantidadEmpresas); 
            });

            // Destruimos el gráfico previo si existe
            if (graficoCircularEmpresas) {
                graficoCircularEmpresas.destroy();
            }

            // Configuración del gráfico
            var ctxPie = document.getElementById("grafico-circular-empresas").getContext('2d'); 
            graficoCircularEmpresas = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: fondo,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }
            });
            GraficoCircularHistorialFichajes();
        },
        error: function (error) {
            console.log('Error al cargar los datos del gráfico: ', error);
        }
    });
}

function generarColorAleatorio() {
    const r = 255; 
    const g = Math.floor(Math.random() * 256); 
    const b = Math.floor(Math.random() * 100); 

    return `rgb(${r}, ${g}, ${b})`;
}

function GraficoCircularHistorialFichajes() {
    const personaID = $("#personaSelect").val(); 
    const fechaDesde = $("#fechaDesde").val();
    const fechaHasta = $("#fechaHasta").val();

    $.ajax({
        type: "POST",
        url: '../../Graficos/GraficoHistorialFichajes',
        data: { PersonaID: personaID, FechaDesde: fechaDesde, FechaHasta: fechaHasta },
        success: function (resultados) {
            console.log(resultados);
            
            var labels = ['Fichajes en Horario', 'Fichajes Fuera de Horario'];
            var data = [resultados.enHorario, resultados.fueraHorario];
            var fondo = ['#36A2EB', '#FF6384']; 
            
            if (graficoCircularHistorialFichajes) {
                graficoCircularHistorialFichajes.destroy();
            }

            var ctxPieFichaje = document.getElementById("grafico-circular-historial-fichajes").getContext('2d');
            graficoCircularHistorialFichajes = new Chart(ctxPieFichaje, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: fondo,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }
            });
        },
        error: function (error) {
            console.log('Error al cargar los datos del gráfico: ', error);
        }
    });
}
