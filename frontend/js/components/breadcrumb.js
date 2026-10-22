(function() {
    var container = document.getElementById('breadcrumb');
    if (!container) return;

    var pageTitles = {
        'proyecto.html': 'Proyecto',
        'telemetria.html': 'Telemetría',
        'documentacion.html': 'Documentación',
        'equipo.html': 'Equipo',
        'galeria.html': 'Galería',
        'noticias.html': 'Noticias',
        'patrocinadores.html': 'Patrocinadores',
        'contacto.html': 'Contacto'
    };

    var current = App.utils.currentPage();
    var inPages = App.utils.isInPages();
    var homeHref = inPages ? '../index.html' : 'index.html';

    var html = '<nav class="breadcrumb">' +
        '<a href="' + homeHref + '" class="breadcrumb-link">Inicio</a>';

    if (pageTitles[current]) {
        html += '<span class="breadcrumb-sep">›</span>' +
            '<span class="breadcrumb-actual">' + pageTitles[current] + '</span>';
    }

    html += '</nav>';
    container.innerHTML = html;
})();
