// let anchoAmpliado = new jsPDF('landscape', 'mm', [210, 297]); // Landscape A4 (210mm x 297mm)

function ImprimirTablaJorAñadidas() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}";
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }

        // ESTABLECER ANCHO DE LÍNEA
        doc.setLineWidth(8);

        // ESTABLECER COLOR DE LÍNEA
        doc.setDrawColor(238, 238, 238);

        // DIBUJAR UNA LÍNEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        // ESTABLECER TAMAÑO Y ESTILO DE FUENTE
        doc.setFontSize(10);
        doc.setFontStyle('bold');

        // AGREGAR TEXTO AL PIE DE PÁGINA
        doc.text(str, 17, pageHeight - 10);
    };

    // Agregar título y fecha a la primera página
    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Jornadas Laborales', 14, 22);

    var element = document.getElementById("imprimir-tablaJornadas");

    // CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88] }, // Color amarillo para el encabezado
        columnStyles: {
            0: { cellWidth: 'auto', fontSize: 10, fillColor: [255, 255, 255] },
            1: { fontSize: 10, fillColor: [255, 255, 255] },
            2: { fontSize: 10, fillColor: [255, 255, 255] },
            3: { fontSize: 10, fillColor: [255, 255, 255] },
            4: { fontSize: 10, fillColor: [255, 255, 255] },
        },
        margin: { top: 30 } // Ajustar margen superior para el título
    });

    // Calcular el total de páginas antes de mostrar el PDF
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    // Abrir el PDF en un nuevo iframe
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}


// function ImprimirTablaJorAsignadas() {
//     var doc = anchoAmpliado;

//     var totalPagesExp = "{total_pages_count_string}"
//     var pageContent = function (data) {

//         var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
//         var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

//         // FOOTER
//         var str = "Página " + doc.internal.getNumberOfPages();
//         if (typeof doc.putTotalPages === 'function') {
//             str = str + " de " + totalPagesExp;
//         }

//         //ESTABLECER ANCHO DE LINEA
//         doc.setLineWidth(8);

//         //ESTABLECER COLOR DE LINEA
//         doc.setDrawColor(238, 238, 238);

//         // DIBUJAR UNA LÍNEA HORIZONTAL
//         doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

//         //ESTABLECER TAMAÑO DE FUENTE
//         doc.setFontSize(10);

//         //ESTABLECER ESTILO DE FUENTE A NEGRITA
//         doc.setFontStyle('bold');

//         //AGREGAR TEXTO AL PIE DE PAGINA
//         doc.text(str, 17, pageHeight - 10);
//     };

//     doc.setFontSize(18);
//     doc.setFontStyle('bold');
//     doc.text('Jornadas Asignadas por Empleado', 14, 22);

//     var element = document.getElementById("imprimir-tablaAsignacion");

//     //CONVERTIR TABLA HTML A JSON
//     var res = doc.autoTableHtmlToJson(element);


//     doc.autoTable(res.columns, res.data, {
//         addPageContent: pageContent,
//         theme: 'grid',
//         styles: { fillColor: [255, 219, 88], fontSize: 12 }, // Color amarillo para el encabezado
//         columnStyles: {
//             0: {
//                 cellWidth: 'auto',
//                 fontSize: 12,
//                 fillColor: [255, 255, 255]
//             },
//             1: {
//                 cellWidth: 'auto',
//                 fontSize: 12,
//                 fillColor: [255, 255, 255]
//             },
//             2: {
//                 cellWidth: 'auto',
//                 fontSize: 12,
//                 fillColor: [255, 255, 255]
//             },
//         },
//         margin: { top: 30 },
//     });

//     // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
//     if (typeof doc.putTotalPages === 'function') {
//         doc.putTotalPages(totalPagesExp);
//     }

//     //doc.save('InformeSistema.pdf')

//     var string = doc.output('datauristring');
//     var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

//     var x = window.open();
//     x.document.open();
//     x.document.write(iframe);
//     x.document.close();
// }

function ImprimirTablaFichajes() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Fichajes', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);


    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88], fontSize: 12 }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            1: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            2: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            3: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 30 },
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function ImprimirTablaEmpresas() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    // Add title and date to the first page
    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Clientes', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88] }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 8,
                fillColor: [255, 255, 255]
            },

            1: {
                fontSize: 7,
                overflow: 'hidden',
                fillColor: [255, 255, 255]
            },

            2: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            3: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            4: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            5: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            6: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            7: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 30 } // Adjust top margin for title
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function ImprimirTablaProvincias() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Provincias', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    // FILTRADO DE COLUMNAS QUE NO SE QUIERE MOSTRAR
    const filtrarColumnas = res.columns.filter((_, index) => index !== 1 && index !== 2);
    const filtrarData = res.data.map(row => row.filter((_, index) => index !== 1 && index !== 2));

    doc.autoTable(filtrarColumnas, filtrarData, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88], fontSize: 12 }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 30 },
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function ImprimirTablaLocalidades() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Localidades', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    // FILTRADO DE COLUMNAS QUE NO SE QUIERE MOSTRAR
    const filtrarColumnas = res.columns.filter((_, index) => index !== 3 && index !== 4);
    const filtrarData = res.data.map(row => row.filter((_, index) => index !== 3 && index !== 4));

    doc.autoTable(filtrarColumnas, filtrarData, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88], fontSize: 12 }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            1: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            2: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 30 },
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function ImprimirTablaUsuarios() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Usuarios', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    // FILTRADO DE COLUMNAS QUE NO SE QUIERE MOSTRAR
    const filtrarColumnas = res.columns.filter((_, index) => index !== 2 && index !== 3 && index !== 4 && index !== 5);
    const filtrarData = res.data.map(row => row.filter((_, index) => index !== 2 && index !== 3 && index !== 4 && index !== 5));

    doc.autoTable(filtrarColumnas, filtrarData, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88], fontSize: 12 }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
            1: {
                cellWidth: 'auto',
                fontSize: 12,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 30 },
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function ImprimirTablaPersonas() {
    var doc = new jsPDF('landscape', 'mm', [210, 297]);

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Página " + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    // Add title and date to the first page
    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Listado de Personas', 14, 22);

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    // FILTRADO DE COLUMNAS QUE NO SE QUIERE MOSTRAR
    // const filtrarColumnas = res.columns.filter((_, index) => index !== 5 && index !== 6);
    // const filtrarData = res.data.map(row => row.filter((_, index) => index !== 5 && index !== 6));

    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88] }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                cellWidth: 'auto',
                fontSize: 8,
                fillColor: [255, 255, 255]
            },

            1: {
                fontSize: 7,
                overflow: 'hidden',
                fillColor: [255, 255, 255]
            },

            2: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            3: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            4: {
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            5: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            6: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },
            7: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },
            8: {
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },


        },
        margin: { top: 30 } // Adjust top margin for title
    });

    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //doc.save('InformeSistema.pdf')

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}