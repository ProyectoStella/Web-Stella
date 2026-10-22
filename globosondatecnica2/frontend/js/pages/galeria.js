var App = window.App || {};
App.galeria = (function() {
    var grupos = [];
    var filtroActual = 'Todas';
    var textoBusqueda = '';
    var grupoActual = null;
    var imagenesActuales = [];
    var indiceImagen = -1;

    function cargar() {
        fetch(App.utils.dataUrl('data/galeria.json'))
            .then(function(r) { return r.json(); })
            .then(function(data) {
                grupos = data;
                renderizarFiltros();
                renderizar();
            })
            .catch(function() {
                var c = document.getElementById('galeria-grid');
                if (c) c.innerHTML = '<p class="galeria-vacio">No se pudo cargar la galería.</p>';
            });

        var searchInput = document.getElementById('galeria-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                textoBusqueda = this.value;
                renderizar();
            });
        }
    }

    function renderizarFiltros() {
        var contenedor = document.getElementById('galeria-filtros');
        if (!contenedor) return;

        var categorias = ['Todas'];
        grupos.forEach(function(g) {
            if (categorias.indexOf(g.categoria) === -1) {
                categorias.push(g.categoria);
            }
        });

        contenedor.innerHTML = categorias.map(function(cat) {
            var activo = cat === filtroActual ? ' activo' : '';
            return '<button class="filtro-btn' + activo + '" data-cat="' + cat + '">' + cat + '</button>';
        }).join('');

        contenedor.addEventListener('click', function(e) {
            var btn = e.target.closest('.filtro-btn');
            if (!btn) return;
            filtroActual = btn.getAttribute('data-cat');
            contenedor.querySelectorAll('.filtro-btn').forEach(function(b) {
                b.classList.toggle('activo', b === btn);
            });
            renderizar();
        });
    }

    function renderizar() {
        var contenedor = document.getElementById('galeria-grid');
        if (!contenedor) return;

        var filtradas = obtenerFiltradas();

        if (!filtradas.length) {
            contenedor.innerHTML = '<p class="galeria-vacio">No se encontraron imágenes con esos criterios.</p>';
            return;
        }

        contenedor.innerHTML = filtradas.map(function(g) {
            var portada = g.imagenes && g.imagenes[0];
            if (!portada) return '';
            var src = App.utils.dataUrl(portada.imagen);
            var cantidad = g.imagenes.length;
            return '<div class="galeria-card" data-id="' + g.id + '" role="button" tabindex="0" aria-label="Abrir galería: ' + g.titulo + '">' +
                '<div class="galeria-card-img-wrapper">' +
                '<img class="galeria-card-img" src="' + src + '" alt="' + g.titulo + '" loading="lazy">' +
                '<div class="galeria-card-overlay">' +
                '<span class="galeria-card-cat">' + g.categoria + '</span>' +
                '<span class="galeria-card-count">' + cantidad + (cantidad === 1 ? ' imagen' : ' imágenes') + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="galeria-card-body">' +
                '<h3>' + g.titulo + '</h3>' +
                '<p>' + g.descripcion + '</p>' +
                '</div></div>';
        }).join('');

        contenedor.querySelectorAll('.galeria-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = parseInt(card.getAttribute('data-id'), 10);
                abrirGrupoPorId(id);
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var id = parseInt(card.getAttribute('data-id'), 10);
                    abrirGrupoPorId(id);
                }
            });
        });
    }

    function obtenerFiltradas() {
        var t = textoBusqueda.toLowerCase();
        return grupos.filter(function(g) {
            if (filtroActual !== 'Todas' && g.categoria !== filtroActual) return false;
            if (!t) return true;
            return (g.titulo && g.titulo.toLowerCase().includes(t)) ||
                   (g.descripcion && g.descripcion.toLowerCase().includes(t)) ||
                   (g.categoria && g.categoria.toLowerCase().includes(t));
        });
    }

    function abrirGrupoPorId(id) {
        var filtradas = obtenerFiltradas();
        for (var i = 0; i < filtradas.length; i++) {
            if (filtradas[i].id === id) {
                abrirLightbox(i);
                return;
            }
        }
    }

    function abrirLightbox(idx) {
        var filtradas = obtenerFiltradas();
        if (!filtradas.length) return;

        grupoActual = filtradas[idx];
        imagenesActuales = grupoActual.imagenes || [];
        if (!imagenesActuales.length) return;
        indiceImagen = 0;
        mostrarImagen();
    }

    function mostrarImagen() {
        var img = imagenesActuales[indiceImagen];
        var lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        var imgEl = document.getElementById('lightbox-img');
        var tituloEl = document.getElementById('lightbox-titulo');
        var descEl = document.getElementById('lightbox-desc');
        var contadorEl = document.getElementById('lightbox-contador');
        var fechaEl = document.getElementById('lightbox-fecha');

        imgEl.src = App.utils.dataUrl(img.imagen);
        imgEl.alt = img.descripcion || grupoActual.titulo;
        tituloEl.textContent = grupoActual.titulo;
        descEl.textContent = img.descripcion;
        contadorEl.textContent = (indiceImagen + 1) + ' / ' + imagenesActuales.length;

        if (fechaEl) {
            fechaEl.textContent = img.fecha || '';
        }

        lightbox.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        renderizarMiniaturas();

        var cerrar = document.getElementById('lightbox-cerrar');
        if (cerrar) cerrar.focus();
    }

    function renderizarMiniaturas() {
        var contenedor = document.getElementById('lightbox-thumbs');
        if (!contenedor) return;

        if (imagenesActuales.length < 2) {
            contenedor.innerHTML = '';
            contenedor.style.display = 'none';
            return;
        }

        contenedor.style.display = 'flex';
        contenedor.innerHTML = imagenesActuales.map(function(img, i) {
            var activo = i === indiceImagen ? ' activo' : '';
            var src = App.utils.dataUrl(img.imagen);
            return '<button class="lightbox-thumb' + activo + '" data-i="' + i + '" aria-label="Imagen ' + (i + 1) + '">' +
                '<img src="' + src + '" alt="" loading="lazy">' +
                '</button>';
        }).join('');

        contenedor.querySelectorAll('.lightbox-thumb').forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                indiceImagen = parseInt(thumb.getAttribute('data-i'), 10);
                mostrarImagen();
            });
        });
    }

    function cerrarLightbox() {
        document.getElementById('lightbox').classList.remove('abierto');
        document.body.style.overflow = '';
    }

    function navegar(dir) {
        if (!imagenesActuales.length) return;
        indiceImagen += dir;
        if (indiceImagen < 0) indiceImagen = imagenesActuales.length - 1;
        if (indiceImagen >= imagenesActuales.length) indiceImagen = 0;
        mostrarImagen();
    }

    document.addEventListener('DOMContentLoaded', function() {
        cargar();

        var lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        document.getElementById('lightbox-cerrar').addEventListener('click', cerrarLightbox);
        document.getElementById('lightbox-ant').addEventListener('click', function() { navegar(-1); });
        document.getElementById('lightbox-sig').addEventListener('click', function() { navegar(1); });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) cerrarLightbox();
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('abierto')) return;
            if (e.key === 'Escape') cerrarLightbox();
            if (e.key === 'ArrowLeft') navegar(-1);
            if (e.key === 'ArrowRight') navegar(1);
        });
    });

    return {};
})();
