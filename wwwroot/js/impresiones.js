function ImprimirTablaEmpresas() {
    var doc = new jsPDF();

    var totalPagesExp = "{total_pages_count_string}"
    var pageContent = function (data) {

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        //FOOTER
        var str = "Pagina" + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages == 'function') {
            str = str + " de " + totalPagesExp;
        }

        //ESTABLECER ANCHO DE LINEA
        doc.setLineWidth(8);

        //ESTABLECER COLOR DE LINEA
        doc.setDrawColor(238, 238, 238);

        //DIBUJAR UNA LINEA HORIZONTAL
        doc.line(14, pageHeight - 11, 196, pageHeight - 11);

        //ESTABLECER TAMAÑO DE FUENTE
        doc.setFontSize(10);

        //ESTABLECER ESTILO DE FUENTE A NEGRITA
        doc.setFontStyle('bold');

        //AGREGAR TEXTO AL PIE DE PAGINA
        doc.text(str, 17, pageHeight - 10);
    };

    var element = document.getElementById("imprimir-tabla");

    //CONVERTIR TABLA HTML A JSON
    var res = doc.autoTableHtmlToJson(element);

    // FILTRADO DE COLUMNAS QUE NO SE QUIERE MOSTRAR
    const filtrarColumnas = res.columns.filter((_, index) => index !== 7 && index !== 8);
    const filtrarData = res.data.map(row => row.filter((_, index) => index !== 7 && index !== 8));

    doc.autoTable(filtrarColumnas, filtrarData, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [255, 219, 88] }, // Color amarillo para el encabezado
        columnStyles: {
            0: {
                halign: 'center',
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },

            1: { halign: 'center', 
                fontSize: 7, 
                overflow: 'hidden', 
                fillColor: [255, 255, 255] 
            },

            2: { 
                halign: 'center', 
                fillColor: [255, 255, 255] 
            },

            3: { 
                halign: 'center', 
                fillColor: [255, 255, 255] 
            },

            4: { 
                halign: 'center', 
                fillColor: [255, 255, 255] 
            },

            5: {
                halign: 'center',
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },
            
            6: {
                halign: 'center',
                cellWidth: 'auto',
                fontSize: 7,
                fillColor: [255, 255, 255]
            },
        },
        margin: { top: 10 },
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