var App = window.App || {};
App.entrevistas = (function() {
    var entrevistasCache = [];

    function cargar() {
        var contenedor = document.getElementById('entrevistas-container');
        if (!contenedor) return;

        fetch(App.utils.dataUrl('data/entrevistas.json'))
            .then(function(r) {
                if (!r.ok) throw new Error('Error al cargar entrevistas.json');
                return r.json();
            })
            .then(function(data) {
                entrevistasCache = data || [];
                renderizar(contenedor, entrevistasCache);
            })
            .catch(function() {
                contenedor.innerHTML = '<p class="entrevistas-vacio">No se pudieron cargar las entrevistas.</p>';
            });
    }

    function renderizar(contenedor, entrevistas) {
        if (!entrevistas.length) {
            contenedor.innerHTML = '<p class="entrevistas-vacio">Todavía no hay entrevistas publicadas.</p>';
            return;
        }

        contenedor.innerHTML = entrevistas.map(function(e) {
            var imagen = e.portada
                ? '<img src="' + App.utils.dataUrl(e.portada) + '" alt="' + e.titulo + '" loading="lazy">'
                : '<div class="entrevista-card-sin-imagen"></div>';
            var medio = e.medio ? '<span class="entrevista-card-medio">' + e.medio + '</span>' : '';
            var fecha = e.fecha ? '<span class="entrevista-card-fecha">' + formatearFecha(e.fecha) + '</span>' : '';
            var descripcion = e.descripcion ? '<p>' + e.descripcion + '</p>' : '';
            var destacado = e.destacado ? '<span class="entrevista-card-destacado">Destacada</span>' : '';

            return '<a class="entrevista-card' + (e.destacado ? ' destacada' : '') + '" href="' + e.link + '" target="_blank" rel="noopener">' +
                '<div class="entrevista-card-img">' + imagen + '<span class="entrevista-card-overlay"></span></div>' +
                '<div class="entrevista-card-body">' +
                    '<div class="entrevista-card-meta">' + medio + fecha + destacado + '</div>' +
                    '<h3>' + e.titulo + '</h3>' +
                    descripcion +
                    '<span class="entrevista-card-cta">Ver entrevista ' + iconoExterno() + '</span>' +
                '</div>' +
            '</a>';
        }).join('');
    }

    function iconoExterno() {
        return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M7 17L17 7"/><path d="M9 7h8v8"/>' +
        '</svg>';
    }

    function formatearFecha(fecha) {
        var partes = String(fecha).split('-');
        if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
        return fecha;
    }

    document.addEventListener('DOMContentLoaded', cargar);

    return {
        obtenerEntrevistas: function() { return entrevistasCache; }
    };
})();
