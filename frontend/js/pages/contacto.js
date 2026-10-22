(function() {
    var container = document.getElementById('contacto-contenido');
    if (!container) return;

    var ICONOS = {
        'institucion': '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',
        'ubicacion': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
        'telefono': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>',
        'usuario': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'asunto': '<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
        'mensaje': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
        'enviar': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        'check': '<path d="M20 6 9 17l-5-5"/>',
        'redes': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>'
    };

    function svg(nombre) {
        return '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[nombre] || '') + '</svg>';
    }

    function campo(id, etiqueta, icono, entrada) {
        return '<div class="contacto-campo">' +
            '<label for="' + id + '">' + etiqueta + '</label>' +
            '<div class="contacto-campo-entrada">' + entrada + svg(icono) + '</div>' +
        '</div>';
    }

    App.cargarConfig().then(function(config) {
        var correo = config.correo || '';
        var telefono = config.telefono || '';
        var sociales = config.redes_sociales || {};
        var redesConUrl = Object.keys(sociales).filter(function(k) { return sociales[k].url; });

        var ubicacion = [config.ciudad, config.provincia, config.pais].filter(Boolean).join(', ');

        function infoItem(icono, etiqueta, valor) {
            if (!valor) return '';
            return '<div class="contacto-item">' +
                '<div class="contacto-item-icono">' + svg(icono) + '</div>' +
                '<div>' +
                    '<div class="contacto-item-label">' + etiqueta + '</div>' +
                    '<div class="contacto-item-valor">' + valor + '</div>' +
                '</div>' +
            '</div>';
        }

        var redesHtml = '';
        if (redesConUrl.length) {
            redesHtml = '<div class="contacto-item">' +
                '<div class="contacto-item-icono">' + svg('redes') + '</div>' +
                '<div>' +
                    '<div class="contacto-item-label">Redes sociales</div>' +
                    '<div class="contacto-redes">' +
                        redesConUrl.map(function(k) {
                            var r = sociales[k];
                            var icono = r.icono ? App.utils.dataUrl(r.icono) : '';
                            if (icono) {
                                return '<a href="' + r.url + '" target="_blank" rel="noopener" aria-label="' + k + '"><img src="' + icono + '" alt="' + k + '"></a>';
                            }
                            return '<a href="' + r.url + '" target="_blank" rel="noopener" aria-label="' + k + '" class="contacto-redes-texto">' + k + '</a>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        var infoHtml =
            '<div class="contacto-card-titulo">Información de contacto</div>' +
            infoItem('institucion', 'Institución', config.escuela) +
            infoItem('ubicacion', 'Ubicación', ubicacion) +
            infoItem('mail', 'Correo electrónico', correo) +
            infoItem('telefono', 'Teléfono', telefono) +
            redesHtml;

        var formHtml =
            '<div class="contacto-card-titulo">Envíanos un mensaje</div>' +
            '<p class="contacto-form-desc">Completá el formulario y te respondemos a tu correo.</p>' +
            '<form id="contacto-form" class="contacto-form" novalidate>' +
                campo('contacto-nombre', 'Nombre', 'usuario', '<input type="text" id="contacto-nombre" name="nombre" required autocomplete="name" placeholder="Tu nombre">') +
                campo('contacto-email', 'Tu correo electrónico', 'mail', '<input type="email" id="contacto-email" name="email" required autocomplete="email" placeholder="tucorreo@ejemplo.com">') +
                campo('contacto-asunto', 'Asunto', 'asunto', '<input type="text" id="contacto-asunto" name="asunto" required placeholder="Motivo del mensaje">') +
                campo('contacto-mensaje', 'Mensaje', 'mensaje', '<textarea id="contacto-mensaje" name="mensaje" rows="5" required placeholder="Escribí tu mensaje..."></textarea>') +
                '<button type="submit" class="contacto-submit" id="contacto-submit">' +
                    '<span class="contacto-submit-spinner" aria-hidden="true"></span>' +
                    '<span class="contacto-submit-texto">Enviar mensaje</span>' +
                    svg('enviar') +
                '</button>' +
                '<p class="contacto-nota" id="contacto-nota"></p>' +
                '<p class="contacto-estado" id="contacto-estado" role="status" aria-live="polite"></p>' +
            '</form>' +
            '<div class="contacto-exito" id="contacto-exito" hidden>' +
                '<div class="contacto-exito-check">' + svg('check') + '</div>' +
                '<div class="contacto-exito-titulo">¡Mensaje enviado!</div>' +
                '<div class="contacto-exito-texto">Gracias por escribirnos. Tu mensaje llegó a nuestro correo y te responderemos a la brevedad.</div>' +
                '<button type="button" class="contacto-exito-btn" id="contacto-exito-btn">Enviar otro mensaje</button>' +
            '</div>';

        container.innerHTML =
            '<div class="contacto-card">' + infoHtml + '</div>' +
            '<div class="contacto-card">' + formHtml + '</div>';

        var form = document.getElementById('contacto-form');
        var estado = document.getElementById('contacto-estado');
        var exito = document.getElementById('contacto-exito');
        var boton = document.getElementById('contacto-submit');
        var textoBoton = boton.querySelector('.contacto-submit-texto');
        var nota = document.getElementById('contacto-nota');

        nota.textContent = config.contacto_endpoint
            ? 'Tu mensaje se envía directamente al correo del proyecto.'
            : 'El mensaje se abrirá en tu programa de correo.';

        var campos = ['contacto-nombre', 'contacto-email', 'contacto-asunto', 'contacto-mensaje'];

        function mostrarError(msg) {
            estado.textContent = msg;
            estado.className = 'contacto-estado contacto-estado-error';
        }

        function limpiarEstado() {
            estado.textContent = '';
            estado.className = 'contacto-estado';
        }

        function validar() {
            var ok = true;
            campos.forEach(function(id) {
                var el = document.getElementById(id);
                var val = el.value.trim();
                var invalido = !val || (id === 'contacto-email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val));
                el.classList.toggle('contacto-campo-invalido', invalido);
                if (invalido) ok = false;
            });
            if (!ok) mostrarError('Completá todos los campos correctamente para enviar el mensaje.');
            return ok;
        }

        campos.forEach(function(id) {
            document.getElementById(id).addEventListener('input', function() {
                this.classList.remove('contacto-campo-invalido');
                limpiarEstado();
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validar()) return;

            var datos = {
                nombre: document.getElementById('contacto-nombre').value.trim(),
                email: document.getElementById('contacto-email').value.trim(),
                asunto: document.getElementById('contacto-asunto').value.trim(),
                mensaje: document.getElementById('contacto-mensaje').value.trim()
            };

            if (config.contacto_endpoint) {
                enviar(datos);
            } else {
                estado.textContent = 'Se abrirá tu programa de correo para completar el envío.';
                estado.className = 'contacto-estado contacto-estado-error';
                var url = 'mailto:' + correo +
                    '?subject=' + encodeURIComponent('[STELLA] ' + datos.asunto) +
                    '&body=' + encodeURIComponent('Nombre: ' + datos.nombre + '\nCorreo: ' + datos.email + '\n\n' + datos.mensaje);
                window.location.href = url;
            }
        });

        function enviar(datos) {
            limpiarEstado();
            form.classList.add('enviando');
            boton.disabled = true;
            textoBoton.textContent = 'Enviando...';

            fetch(config.contacto_endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(datos)
            }).then(function(respuesta) {
                return respuesta.json();
            }).then(function(resultado) {
                if (resultado && resultado.ok) {
                    form.hidden = true;
                    exito.hidden = false;
                } else {
                    mostrarError((resultado && resultado.mensaje) || 'No se pudo enviar el mensaje. Intentalo de nuevo.');
                }
            }).catch(function() {
                mostrarError('No se pudo enviar el mensaje. Revisá tu conexión e intentalo de nuevo.');
            }).then(function() {
                form.classList.remove('enviando');
                boton.disabled = false;
                textoBoton.textContent = 'Enviar mensaje';
            });
        }

        document.getElementById('contacto-exito-btn').addEventListener('click', function() {
            exito.hidden = true;
            form.hidden = false;
            form.reset();
            limpiarEstado();
        });
    }).catch(function() {
        container.innerHTML = '<p class="contacto-cargando">No se pudo cargar la información de contacto.</p>';
    });
})();
