var App = window.App || {};
App.proyecto = (function() {
    var datos = null;

    function cargar() {
        fetch(App.utils.dataUrl('data/proyecto.json'))
            .then(function(r) { return r.json(); })
            .then(function(data) {
                datos = data;
                renderizarSecciones();
                renderizarInfografia();
                observarAnimaciones();
            })
            .catch(function() {
                var c = document.getElementById('proyecto-contenido');
                if (c) c.innerHTML = '<p class="proyecto-vacio">No se pudo cargar la información del proyecto.</p>';
            });
    }

    function renderizarSecciones() {
        var contenedor = document.getElementById('proyecto-contenido');
        if (!contenedor || !datos || !datos.sections) return;

        contenedor.innerHTML = datos.sections.map(function(sec) {
            var html = '';
            switch (sec.tipo) {
                case 'texto':
                    html = renderTexto(sec);
                    break;
                case 'pasos':
                    html = renderPasos(sec);
                    break;
                case 'cards':
                    html = renderCards(sec);
                    break;
                case 'areas':
                    html = renderAreas(sec);
                    break;
            }
            return '<div id="' + sec.id + '" class="proyecto-section animar-entrada">' + html + '</div>';
        }).join('');
    }

    function renderTexto(sec) {
        return '<h2 class="proyecto-titulo">' + sec.titulo + '</h2>' +
            sec.contenido.map(function(p) {
                return '<p class="proyecto-parrafo">' + p + '</p>';
            }).join('');
    }

    function renderPasos(sec) {
        return '<h2 class="proyecto-titulo">' + sec.titulo + '</h2>' +
            '<div class="proyecto-pasos">' +
            sec.pasos.map(function(paso, i) {
                return '<div class="proyecto-paso">' +
                    '<div class="proyecto-paso-num">' + (i + 1) + '</div>' +
                    '<div class="proyecto-paso-body">' +
                    '<h3>' + paso.titulo + '</h3>' +
                    '<p>' + paso.descripcion + '</p>' +
                    '</div></div>';
            }).join('') +
            '</div>';
    }

    function renderCards(sec) {
        return '<h2 class="proyecto-titulo">' + sec.titulo + '</h2>' +
            '<div class="proyecto-cards-grid">' +
            sec.items.map(function(item) {
                var iconoHtml = '';
                if (item.icono) {
                    var svg = App.iconos ? App.iconos.desdeEmoji(item.icono) : item.icono;
                    iconoHtml = '<div class="proyecto-card-icono">' + svg + '</div>';
                }
                return '<div class="proyecto-card">' +
                    iconoHtml +
                    '<h3>' + item.nombre + '</h3>' +
                    '<p>' + item.descripcion + '</p>' +
                    '</div>';
            }).join('') +
            '</div>';
    }

    function renderAreas(sec) {
        var intro = sec.intro || 'El equipo se organiza en áreas interconectadas que trabajan de forma coordinada:';
        return '<h2 class="proyecto-titulo">' + sec.titulo + '</h2>' +
            '<p class="proyecto-parrafo">' + intro + '</p>' +
            '<div class="proyecto-areas">' +
            sec.areas.map(function(area, i) {
                var flecha = i < sec.areas.length - 1 ? '<div class="proyecto-areas-flecha">↓</div>' : '';
                var iconoHtml = area.icono && App.iconos ? '<div class="proyecto-area-icono">' + App.iconos.desdeEmoji(area.icono) + '</div>' : '';
                return '<div class="proyecto-area">' +
                    iconoHtml +
                    '<div class="proyecto-area-nombre">' + area.nombre + '</div>' +
                    '<p class="proyecto-area-desc">' + area.descripcion + '</p>' +
                    '</div>' + flecha;
            }).join('') +
            '</div>';
    }

    function renderizarInfografia() {
        var contenedor = document.getElementById('proyecto-infografia');
        if (!contenedor || !datos || !datos.infografia) return;

        var info = datos.infografia;
        contenedor.innerHTML =
            '<h2 class="proyecto-titulo">' + info.titulo + '</h2>' +
            '<div class="proyecto-infografia-linea">' +
            info.pasos.map(function(paso, i) {
                var esUltimo = i === info.pasos.length - 1;
                var iconoHtml = App.iconos ? App.iconos.desdeEmoji(paso.icono) : paso.icono;
                return '<div class="proyecto-infografia-paso">' +
                    '<div class="proyecto-infografia-icono">' + iconoHtml + '<span class="proyecto-infografia-numero">' + (i + 1) + '</span></div>' +
                    '<div class="proyecto-infografia-nombre">' + paso.nombre + '</div>' +
                    (!esUltimo ? '<div class="proyecto-infografia-conector"></div>' : '') +
                    '</div>';
            }).join('') +
            '</div>';
    }

    function observarAnimaciones() {
        var elementos = document.querySelectorAll('.animar-entrada');
        if (!elementos.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animar-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            elementos.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            elementos.forEach(function(el) {
                el.classList.add('animar-visible');
            });
        }
    }

    document.addEventListener('DOMContentLoaded', cargar);

    return {};
})();
