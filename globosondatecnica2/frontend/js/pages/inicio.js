var App = window.App || {};
App.inicio = (function() {
    var animadoStats = false;
    var meses = { 'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11 };

    function cargar() {
        var promesas = {
            estado: fetch(App.utils.dataUrl('data/estado.json')).then(function(r) { return r.json(); }),
            stats: fetch(App.utils.dataUrl('data/estadisticas.json')).then(function(r) { return r.json(); }),
            proyecto: fetch(App.utils.dataUrl('data/proyecto.json')).then(function(r) { return r.json(); }),
            documentos: fetch(App.utils.dataUrl('data/documentos.json')).then(function(r) { return r.json(); }),
            galeria: fetch(App.utils.dataUrl('data/galeria.json')).then(function(r) { return r.json(); }),
            patrocinadores: fetch(App.utils.dataUrl('data/patrocinadores.json')).then(function(r) { return r.json(); }),
            noticias: fetch(App.utils.dataUrl('data/noticias.json')).then(function(r) { return r.json(); }),
            config: App.cargarConfig()
        };

        Promise.allSettled(
            Object.keys(promesas).map(function(k) {
                return promesas[k].then(function(v) { return { clave: k, valor: v }; });
            })
        ).then(function(resultados) {
            var datos = {};
            resultados.forEach(function(r) {
                if (r.status === 'fulfilled') {
                    datos[r.value.clave] = r.value.valor;
                }
            });
            renderizarTodo(datos);
            observarAnimaciones();
        });
    }

    function renderizarTodo(datos) {
        renderizarHero(datos.config);
        renderizarEstado(datos.estado, datos.config);
        renderizarStats(datos.stats, datos.documentos);
        renderizarResumen(datos.proyecto);
        renderizarAreas(datos.proyecto);
        renderizarTecnologias(datos.proyecto);
        renderizarDocumentos(datos.documentos);
        renderizarGaleria(datos.galeria);
        renderizarPatrocinadores(datos.patrocinadores);
        renderizarNoticias(datos.noticias);
        renderizarContacto(datos.config);
    }

    function parsearFechaLanzamiento(texto) {
        if (!texto) return null;
        var m = texto.match(/(\w+)\s+de\s+(\d{4})/i);
        if (!m) return null;
        var mes = meses[(m[1] || '').toLowerCase()];
        if (mes === undefined) return null;
        return new Date(parseInt(m[2], 10), mes, 1);
    }

    function diasHasta(fecha) {
        if (!fecha) return null;
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return Math.max(0, Math.ceil((fecha.getTime() - hoy.getTime()) / 86400000));
    }

    function renderizarHero(config) {
        var c = document.getElementById('home-hero');
        if (!c || !config) return;
        var h1 = c.querySelector('h1');
        var p = c.querySelector('p');
        if (h1) h1.textContent = config.hero_titulo || '';
        if (p) p.textContent = config.hero_descripcion || '';

        var badgeEl = c.querySelector('.hero-badge');
        if (badgeEl) {
            badgeEl.textContent = 'Próximo lanzamiento: indefinido';
            badgeEl.style.display = 'inline-flex';
        }
    }

    function renderizarContacto(config) {
        var c = document.getElementById('home-contacto');
        if (!c || !config) return;
        c.innerHTML = '<div class="home-contacto-card animar-entrada">' +
            '<h3>Contacto</h3>' +
            '<div class="home-contacto-institucion">' + (config.escuela || '') + '</div>' +
            '<div class="home-contacto-ubicacion">' + (config.ciudad || '') + ', ' + (config.provincia || '') + ', ' + (config.pais || '') + '</div>' +
            '<div class="home-contacto-email">' + (config.correo || '') + '</div>' +
            '<a href="' + App.utils.dataUrl('pages/contacto.html') + '" class="hero-btn">Contactar</a>' +
            '</div>';
    }

    function renderizarEstado(estado, config) {
        var c = document.getElementById('home-estado');
        if (!c || !estado) return;

        var progreso = estado.progreso || 0;
        var etapasHtml = '';
        if (estado.etapas && estado.etapas.length) {
            etapasHtml = '<div class="home-etapas">' + estado.etapas.map(function(e) {
                return '<span class="home-etapa' + (e.completa ? ' completa' : '') + '">' + e.nombre + '</span>';
            }).join('') + '</div>';
        }

        c.innerHTML = '<div class="home-estado-card animar-entrada">' +
            '<div class="home-estado-label">Estado del proyecto</div>' +
            '<div class="home-estado-indicador">' +
            '<span class="home-estado-luz">' + (estado.color || '🟡') + '</span>' +
            '<span class="home-estado-texto">' + (estado.estado || '') + '</span>' +
            '</div>' +
            '<p class="home-estado-desc">' + (estado.descripcion || '') + '</p>' +
            '<div class="home-progreso">' +
            '<div class="home-progreso-barra"><div class="home-progreso-relleno" style="width:' + progreso + '%"></div></div>' +
            '<span class="home-progreso-texto">' + progreso + '% de avance</span>' +
            '</div>' +
            etapasHtml +
            '<div class="home-estado-lanzamiento">Próximo lanzamiento: indefinido</div>' +
            '</div>';
    }

    function renderizarStats(stats, documentos) {
        var c = document.getElementById('home-stats-grid');
        if (!c || !stats) return;

        var cantidadDocumentos = (documentos && documentos.length) ? documentos.length : null;

        c.innerHTML = stats.map(function(stat) {
            var valor = stat.valor;
            if (stat.origen === 'documentos' && cantidadDocumentos !== null) {
                valor = cantidadDocumentos;
            }
            var unidadHtml = stat.unidad ? '<span class="home-stat-unidad">' + stat.unidad + '</span>' : '';
            var iconoHtml = App.iconos ? '<div class="home-stat-icono">' + App.iconos.desdeEmoji(stat.icono) + '</div>' : '';
            return '<div class="home-stat-card animar-entrada">' +
                iconoHtml +
                '<div class="home-stat-numero" data-valor="' + valor + '">0' + unidadHtml + '</div>' +
                '<div class="home-stat-titulo">' + stat.titulo + '</div>' +
                '<div class="home-stat-desc">' + stat.descripcion + '</div>' +
                '</div>';
        }).join('');

        animarNumeros();
    }

    function animarNumeros() {
        if (animadoStats) return;
        animadoStats = true;

        var elementos = document.querySelectorAll('#home-stats-grid .home-stat-numero');
        elementos.forEach(function(el) {
            var valorRaw = el.getAttribute('data-valor') || '0';
            var valorFinal = parseFloat(valorRaw);
            var unidad = el.querySelector('.home-stat-unidad');
            var duracion = 1200;
            var inicio = performance.now();

            if (isNaN(valorFinal)) {
                if (unidad) {
                    el.childNodes[0].textContent = valorRaw;
                } else {
                    el.textContent = valorRaw;
                }
                return;
            }

            var decimales = (valorRaw.split('.')[1] || '').length;
            var esDecimal = decimales > 0;

            function paso(ahora) {
                var progreso = Math.min((ahora - inicio) / duracion, 1);
                var curva = 1 - Math.pow(1 - progreso, 3);
                var actual = valorFinal * curva;
                var texto = esDecimal ? actual.toFixed(decimales) : String(Math.round(actual));

                if (unidad) {
                    el.childNodes[0].textContent = texto;
                } else {
                    el.textContent = texto;
                }

                if (progreso < 1) {
                    requestAnimationFrame(paso);
                }
            }

            requestAnimationFrame(paso);
        });
    }

    function renderizarResumen(proyecto) {
        var c = document.getElementById('home-resumen');
        if (!c || !proyecto || !proyecto.home_resumen) return;

        c.innerHTML = proyecto.home_resumen.map(function(p) {
            return '<p class="home-resumen-parrafo">' + p + '</p>';
        }).join('') +
        '<a href="' + App.utils.dataUrl('pages/proyecto.html') + '" class="home-btn">Conocer más</a>';
    }

    function renderizarAreas(proyecto) {
        var c = document.getElementById('home-areas');
        if (!c || !proyecto || !proyecto.sections) return;

        var areasSec = null;
        proyecto.sections.forEach(function(s) {
            if (s.id === 'como-trabajamos') areasSec = s;
        });
        if (!areasSec || !areasSec.areas) return;

        var iconos = ['👥', '📋', '🔧', '🖥️', '📡', '🎨'];
        c.innerHTML = areasSec.areas.map(function(area, i) {
            var flecha = i < areasSec.areas.length - 1 ? '<div class="home-areas-flecha">↓</div>' : '';
            var iconoHtml = App.iconos ? '<div class="home-area-icono">' + App.iconos.desdeEmoji(iconos[i] || '✨') + '</div>' : '';
            return '<div class="home-area animar-entrada">' +
                iconoHtml +
                '<div class="home-area-nombre">' + area.nombre + '</div>' +
                '<p class="home-area-desc">' + area.descripcion + '</p>' +
                '</div>' + flecha;
        }).join('');
    }

    function renderizarTecnologias(proyecto) {
        var c = document.getElementById('home-tecnologias');
        if (!c || !proyecto || !proyecto.sections) return;

        var tecSec = null;
        proyecto.sections.forEach(function(s) {
            if (s.id === 'tecnologias') tecSec = s;
        });
        if (!tecSec || !tecSec.items) return;

        c.innerHTML = tecSec.items.slice(0, 6).map(function(item) {
            return '<div class="home-tec-card animar-entrada">' +
                '<h4>' + item.nombre + '</h4>' +
                '<p>' + item.descripcion + '</p>' +
                '</div>';
        }).join('') +
        '<div class="home-tec-ver-todas animar-entrada">' +
        '<a href="' + App.utils.dataUrl('pages/proyecto.html') + '#tecnologias" class="home-btn">Ver todas las tecnologías</a></div>';
    }

    function renderizarDocumentos(documentos) {
        var c = document.getElementById('home-documentos');
        if (!c || !documentos || !documentos.length) return;

        var ultimos = documentos.slice(-3).reverse();
        c.innerHTML = ultimos.map(function(doc) {
            var ruta = App.utils.dataUrl(doc.archivo || doc.ruta);
            return '<div class="home-doc-card animar-entrada">' +
                '<div class="home-doc-tipo">' + doc.tipo + '</div>' +
                '<h4>' + doc.titulo + '</h4>' +
                '<a href="' + ruta + '" class="home-btn home-btn-small" target="_blank">Ver</a>' +
                '</div>';
        }).join('') +
        '<div class="home-doc-ver-todas animar-entrada">' +
        '<a href="' + App.utils.dataUrl('pages/documentacion.html') + '" class="home-btn">Ver toda la documentación</a></div>';
    }

    function renderizarGaleria(galeria) {
        var c = document.getElementById('home-galeria');
        if (!c || !galeria || !galeria.length) return;

        var destacadas = galeria.slice(0, 4);
        c.innerHTML = destacadas.map(function(g) {
            var portada = g.imagenes && g.imagenes[0];
            var src = App.utils.dataUrl(portada ? portada.imagen : (g.imagen || g.ruta));
            return '<div class="home-galeria-item animar-entrada">' +
                '<img src="' + src + '" alt="' + g.titulo + '" loading="lazy">' +
                '<div class="home-galeria-item-overlay">' + g.titulo + '</div>' +
                '</div>';
        }).join('') +
        '<div class="home-galeria-ver-todas animar-entrada">' +
        '<a href="' + App.utils.dataUrl('pages/galeria.html') + '" class="home-btn">Ir a la galería</a></div>';
    }

    function renderizarPatrocinadores(patrocinadores) {
        var c = document.getElementById('home-patrocinadores');
        if (!c || !patrocinadores || !patrocinadores.length) return;

        var destacados = patrocinadores.slice(0, 4);
        c.innerHTML = destacados.map(function(p) {
            var logoUrl = p.logo ? App.utils.dataUrl(p.logo) : App.utils.dataUrl('assets/logos/default-logo.svg');
            var img = '<img src="' + logoUrl + '" alt="' + p.nombre + '" loading="lazy" onerror="this.src=\'' + App.utils.dataUrl('assets/logos/default-logo.svg') + '\'">';
            var card = '<div class="home-pat-card animar-entrada">' + img + '</div>';
            if (p.sitio_web) {
                card = '<a class="home-pat-link" href="' + p.sitio_web + '" target="_blank" rel="noopener" aria-label="' + p.nombre + '">' + card + '</a>';
            }
            return card;
        }).join('') +
        '<div class="home-pat-ver-todos animar-entrada">' +
        '<a href="' + App.utils.dataUrl('pages/patrocinadores.html') + '" class="home-btn">Ver todos</a></div>';
    }

    function renderizarNoticias(noticias) {
        var c = document.getElementById('home-noticias');
        if (!c || !noticias || !noticias.length) {
            if (c) c.style.display = 'none';
            return;
        }

        c.innerHTML = noticias.slice(0, 3).map(function(n) {
            var fecha = n.fecha ? '<span class="home-noticia-fecha">' + n.fecha + '</span>' : '';
            return '<div class="home-noticia-card animar-entrada">' +
                fecha +
                '<h4>' + n.titulo + '</h4>' +
                '<p>' + n.descripcion + '</p>' +
                '</div>';
        }).join('') +
        '<div class="home-noticias-ver-todas animar-entrada">' +
        '<a href="' + App.utils.dataUrl('pages/noticias.html') + '" class="home-btn">Ver todas las novedades</a></div>';
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
