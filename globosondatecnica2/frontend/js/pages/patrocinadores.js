var App = window.App || {};
App.patrocinadores = (function() {
    var patrocinadores = [];

    function cargar() {
        Promise.all([
            fetch(App.utils.dataUrl('data/patrocinadores.json')).then(function(r) { return r.json(); }),
            App.cargarConfig()
        ]).then(function(resultados) {
            patrocinadores = resultados[0];
            renderizar(resultados[1]);
        }).catch(function() {
            var c = document.getElementById('patrocinadores-contenido');
            if (c) c.innerHTML = '<p class="patrocinadores-vacio">No se pudieron cargar los patrocinadores.</p>';
        });
    }

    function agruparPorCategoria(lista) {
        var grupos = {};
        var ordenCategorias = [];

        lista.forEach(function(p) {
            var cat = p.categoria || 'Otros';
            if (!grupos[cat]) {
                grupos[cat] = [];
                ordenCategorias.push(cat);
            }
            grupos[cat].push(p);
        });

        return { grupos: grupos, orden: ordenCategorias };
    }

    function renderizar(config) {
        var contenedor = document.getElementById('patrocinadores-contenido');
        if (!contenedor) return;

        var correo = (config && config.correo) || 'santatrinidad2026@gmail.com';
        var intro = '<div class="patrocinadores-intro">' +
            '<h3>Buscamos sponsors</h3>' +
            '<p>El proyecto está buscando apoyo económico para financiar componentes, materiales, pruebas y el lanzamiento. Si tu empresa o institución quiere colaborar, escribinos a ' +
            '<a href="mailto:' + correo + '" style="color:#4fc3f7;">' + correo + '</a>.</p>' +
            '</div>';

        if (!patrocinadores.length) {
            contenedor.innerHTML = intro + '<p class="patrocinadores-vacio">No hay patrocinadores registrados.</p>';
            return;
        }

        var agrupado = agruparPorCategoria(patrocinadores);

        contenedor.innerHTML = intro + agrupado.orden.map(function(cat) {
            var items = agrupado.grupos[cat].map(function(p) {
                var logoUrl = p.logo ? App.utils.dataUrl(p.logo) : App.utils.dataUrl('assets/logos/default-logo.svg');
                var sitioHtml = p.sitio_web
                    ? '<a href="' + p.sitio_web + '" class="patrocinadores-btn" target="_blank" rel="noopener">Visitar sitio web</a>'
                    : '';
                var logoImg = '<img class="patrocinadores-logo" src="' + logoUrl + '" alt="' + p.nombre + '" loading="lazy" onerror="this.src=\'' + App.utils.dataUrl('assets/logos/default-logo.svg') + '\'">';
                var logoHtml = p.sitio_web
                    ? '<a class="patrocinadores-logo-link" href="' + p.sitio_web + '" target="_blank" rel="noopener" aria-label="' + p.nombre + '">' + logoImg + '</a>'
                    : logoImg;
                return '<div class="patrocinadores-card">' +
                    '<div class="patrocinadores-logo-wrapper">' +
                    logoHtml +
                    '</div>' +
                    '<div class="patrocinadores-card-body">' +
                    '<h3>' + p.nombre + '</h3>' +
                    '<p>' + p.descripcion + '</p>' +
                    sitioHtml +
                    '</div></div>';
            }).join('');

            return '<div class="patrocinadores-grupo">' +
                '<h3 class="patrocinadores-cat-titulo">' + cat + '</h3>' +
                '<div class="patrocinadores-grid">' + items + '</div></div>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', cargar);

    return {};
})();
