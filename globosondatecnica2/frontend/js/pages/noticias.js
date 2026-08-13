var App = window.App || {};
App.noticias = (function() {
    function cargar() {
        fetch(App.utils.dataUrl('data/noticias.json'))
            .then(function(r) { return r.json(); })
            .then(function(datos) {
                renderizar(datos);
            })
            .catch(function() {
                var c = document.getElementById('noticias-container');
                if (c) c.innerHTML = '<p class="noticias-vacio">No se pudieron cargar las noticias.</p>';
            });
    }

    function renderizar(noticias) {
        var contenedor = document.getElementById('noticias-container');
        if (!contenedor) return;

        if (!noticias || !noticias.length) {
            contenedor.innerHTML = '<p class="noticias-vacio">Todavía no hay novedades publicadas.</p>';
            return;
        }

        contenedor.innerHTML = noticias.map(function(n) {
            var cat = n.categoria ? '<span class="noticia-cat">' + n.categoria + '</span>' : '';
            var fecha = n.fecha ? '<span class="noticia-fecha">' + n.fecha + '</span>' : '';
            return '<article class="noticia-card">' +
                '<div class="noticia-meta">' + cat + fecha + '</div>' +
                '<h2>' + n.titulo + '</h2>' +
                '<p>' + n.descripcion + '</p>' +
                '</article>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', cargar);

    return {};
})();
