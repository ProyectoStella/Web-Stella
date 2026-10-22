var App = window.App || {};
App.documentacion = (function() {
    var docsCache = [];
    var filtroCategoria = 'Todas';
    var textoBusqueda = '';
    var ordenActual = 'recientes';

    function init() {
        fetch(App.utils.dataUrl('data/documentos.json'))
            .then(function(r) { return r.json(); })
            .then(function(data) {
                docsCache = data;
                renderizarEstadisticas();
                renderizarFiltros();
                renderizarOrdenamiento();
                aplicarFiltros();
            })
            .catch(function() {
                var c = document.getElementById('documentos-container');
                if (c) c.innerHTML = '<p class="doc-vacio">No se pudieron cargar los documentos.</p>';
            });

        var searchInput = document.getElementById('doc-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                textoBusqueda = this.value;
                aplicarFiltros();
            });
        }
    }

    function renderizarEstadisticas() {
        var c = document.getElementById('doc-estadisticas');
        if (!c || !docsCache.length) return;

        var total = docsCache.length;
        var conteo = {};
        docsCache.forEach(function(d) {
            conteo[d.categoria] = (conteo[d.categoria] || 0) + 1;
        });
        var categorias = Object.keys(conteo).sort(function(a, b) {
            return conteo[b] - conteo[a] || a.localeCompare(b);
        });
        var totalCat = categorias.length;

        var html =
            '<div class="doc-stat-item"><span class="doc-stat-num">' + total + '</span><span class="doc-stat-label">Documentos</span></div>' +
            '<div class="doc-stat-item"><span class="doc-stat-num">' + totalCat + '</span><span class="doc-stat-label">Categorías</span></div>';

        categorias.slice(0, 2).forEach(function(cat) {
            html += '<div class="doc-stat-item"><span class="doc-stat-num">' + conteo[cat] + '</span><span class="doc-stat-label">' + cat + '</span></div>';
        });

        c.innerHTML = html;
    }

    function renderizarFiltros() {
        var contenedor = document.getElementById('doc-filtros');
        if (!contenedor) return;

        var categorias = ['Todas'];
        docsCache.forEach(function(d) {
            if (categorias.indexOf(d.categoria) === -1) categorias.push(d.categoria);
        });

        contenedor.innerHTML = categorias.map(function(cat) {
            var activo = cat === filtroCategoria ? ' activo' : '';
            return '<button class="doc-filtro-btn' + activo + '" data-cat="' + cat + '">' + cat + '</button>';
        }).join('');

        contenedor.addEventListener('click', function(e) {
            var btn = e.target.closest('.doc-filtro-btn');
            if (!btn) return;
            filtroCategoria = btn.getAttribute('data-cat');
            contenedor.querySelectorAll('.doc-filtro-btn').forEach(function(b) {
                b.classList.toggle('activo', b === btn);
            });
            aplicarFiltros();
        });
    }

    function renderizarOrdenamiento() {
        var sel = document.getElementById('doc-orden');
        if (!sel) return;
        sel.value = ordenActual;
        sel.addEventListener('change', function() {
            ordenActual = this.value;
            aplicarFiltros();
        });
    }

    function obtenerRuta(doc) {
        return App.utils.dataUrl(doc.archivo || doc.ruta || '');
    }

    function obtenerPortada(doc) {
        if (doc.portada) return App.utils.dataUrl(doc.portada);
        return App.utils.dataUrl('assets/images/documentos/default-portada.svg');
    }

    function extension(archivo) {
        if (!archivo) return '';
        var partes = archivo.split('.');
        return partes.length > 1 ? partes[partes.length - 1].toLowerCase() : '';
    }

    function esPDF(doc) {
        var ext = extension(doc.archivo || doc.ruta);
        return ext === 'pdf';
    }

    function aplicarFiltros() {
        var contenedor = document.getElementById('documentos-container');
        var destacadosEl = document.getElementById('doc-destacados');
        if (!contenedor) return;

        var filtrados = docsCache.filter(function(d) {
            if (filtroCategoria !== 'Todas' && d.categoria !== filtroCategoria) return false;
            if (!textoBusqueda) return true;
            var t = textoBusqueda.toLowerCase();
            return (d.titulo && d.titulo.toLowerCase().includes(t)) ||
                   (d.descripcion && d.descripcion.toLowerCase().includes(t)) ||
                   (d.categoria && d.categoria.toLowerCase().includes(t)) ||
                   (d.tipo && d.tipo.toLowerCase().includes(t)) ||
                   (d.autor && d.autor.toLowerCase().includes(t));
        });

        if (ordenActual === 'recientes') {
            filtrados.sort(function(a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); });
        } else if (ordenActual === 'antiguos') {
            filtrados.sort(function(a, b) { return (a.fecha || '').localeCompare(b.fecha || ''); });
        } else if (ordenActual === 'alfabetico') {
            filtrados.sort(function(a, b) { return (a.titulo || '').localeCompare(b.titulo || ''); });
        }

        if (destacadosEl) renderizarDestacados(destacadosEl, filtrados);
        renderizarCards(contenedor, filtrados);
    }

    function renderizarDestacados(contenedor, filtrados) {
        var destacados = [];
        filtrados.forEach(function(d) {
            if (d.destacado) destacados.push(d);
        });

        if (!destacados.length) {
            contenedor.style.display = 'none';
            return;
        }
        contenedor.style.display = '';

        contenedor.innerHTML = destacados.map(function(doc) {
            var portada = obtenerPortada(doc);
            var ruta = obtenerRuta(doc);
            var isPDF = esPDF(doc);
            var versionHtml = doc.version ? '<span class="doc-version">v' + doc.version + '</span>' : '';
            var autorHtml = doc.autor ? '<span class="doc-autor">' + doc.autor + '</span>' : '';
            return '<div class="doc-destacado-card">' +
                '<div class="doc-destacado-img">' +
                    '<img src="' + portada + '" alt="' + doc.titulo + '" loading="lazy">' +
                '</div>' +
                '<div class="doc-destacado-body">' +
                    '<div class="doc-destacado-meta">' +
                        '<span class="doc-tipo-badge">' + doc.tipo + '</span>' +
                        '<span class="doc-cat-badge">' + doc.categoria + '</span>' +
                        autorHtml +
                        versionHtml +
                    '</div>' +
                    '<h3>' + doc.titulo + '</h3>' +
                    '<p>' + doc.descripcion + '</p>' +
                    '<div class="doc-destacado-acciones">' +
                        (isPDF ? '<button class="doc-btn doc-btn-preview" data-id="' + doc.id + '">Vista previa</button>' : '') +
                        '<a href="' + ruta + '" target="_blank" class="doc-btn">Abrir</a>' +
                        '<a href="' + ruta + '" download class="doc-btn doc-btn-secundario">Descargar</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        contenedor.querySelectorAll('.doc-btn-preview').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'), 10);
                var doc = null;
                for (var i = 0; i < docsCache.length; i++) {
                    if (docsCache[i].id === id) { doc = docsCache[i]; break; }
                }
                if (doc) abrirPDF(doc);
            });
        });
    }

    function renderizarCards(contenedor, docs) {
        if (!docs.length) {
            contenedor.innerHTML = '<p class="doc-vacio">No se encontraron documentos con esos criterios.</p>';
            return;
        }

        contenedor.innerHTML = docs.map(function(doc) {
            var portada = obtenerPortada(doc);
            var ruta = obtenerRuta(doc);
            var isPDF = esPDF(doc);
            var versionHtml = doc.version ? '<span class="doc-card-version">v' + doc.version + '</span>' : '';
            var autorHtml = doc.autor ? '<span class="doc-card-autor">' + doc.autor + '</span>' : '';
            var fechaHtml = doc.fecha ? '<span class="doc-card-fecha">' + doc.fecha + '</span>' : '';
            var descHtml = doc.descripcion ? '<p>' + doc.descripcion + '</p>' : '';
            var destacadoHtml = doc.destacado ? '<span class="doc-card-destacado-badge">Destacado</span>' : '';

            return '<div class="doc-card">' +
                '<div class="doc-card-img">' +
                    '<img src="' + portada + '" alt="' + doc.titulo + '" loading="lazy">' +
                '</div>' +
                '<div class="doc-card-body">' +
                    '<div class="doc-card-meta">' +
                        '<span class="doc-tipo-badge">' + doc.tipo + '</span>' +
                        '<span class="doc-cat-badge">' + doc.categoria + '</span>' +
                        fechaHtml +
                        destacadoHtml +
                    '</div>' +
                    '<h3>' + doc.titulo + '</h3>' +
                    descHtml +
                    '<div class="doc-card-footer">' +
                        '<div class="doc-card-footer-info">' +
                            autorHtml +
                            versionHtml +
                        '</div>' +
                        '<div class="doc-card-acciones">' +
                            (isPDF ? '<button class="doc-btn doc-btn-sm doc-btn-preview" data-id="' + doc.id + '">Vista previa</button>' : '') +
                            '<a href="' + ruta + '" target="_blank" class="doc-btn doc-btn-sm">Abrir</a>' +
                            '<a href="' + ruta + '" download class="doc-btn doc-btn-sm doc-btn-secundario">Descargar</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        contenedor.querySelectorAll('.doc-btn-preview').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'), 10);
                var doc = null;
                for (var i = 0; i < docsCache.length; i++) {
                    if (docsCache[i].id === id) { doc = docsCache[i]; break; }
                }
                if (doc) abrirPDF(doc);
            });
        });
    }

    function abrirPDF(doc) {
        var modal = document.getElementById('pdf-modal');
        var viewer = document.getElementById('pdf-viewer');
        var titulo = document.getElementById('pdf-modal-titulo');
        var downloadLink = document.getElementById('pdf-modal-download');
        var ruta = obtenerRuta(doc);

        viewer.src = ruta;
        titulo.textContent = doc.titulo;
        downloadLink.href = ruta;

        modal.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        var cerrar = document.getElementById('pdf-modal-cerrar');
        if (cerrar) cerrar.focus();
    }

    function cerrarPDF() {
        var modal = document.getElementById('pdf-modal');
        var viewer = document.getElementById('pdf-viewer');
        modal.classList.remove('abierto');
        document.body.style.overflow = '';
        viewer.src = '';
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('documentos-container')) {
            init();
        }

        var modal = document.getElementById('pdf-modal');
        if (modal) {
            document.getElementById('pdf-modal-cerrar').addEventListener('click', cerrarPDF);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) cerrarPDF();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('abierto')) cerrarPDF();
            });
        }
    });

    return {};
})();
