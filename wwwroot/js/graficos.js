window.onload = GraficoCircularEmpresas;

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
            var ctxPie = document.getElementById("grafico-circular-empresas").getContext('2d'); // Obtener el contexto 2D del canvas
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
        },
        error: function (error) {
            console.log('Error al cargar los datos del gráfico: ', error);
        }
    });
}

function generarColorAleatorio() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}
