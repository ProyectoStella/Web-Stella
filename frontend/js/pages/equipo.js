(function() {
    async function render() {
        var container = document.getElementById('equipo-container');
        if (!container) return;

        var subtitle = document.getElementById('equipo-subtitle');
        if (subtitle) {
            App.cargarConfig().then(function(config) {
                subtitle.innerHTML = 'Alumnos de ' + (config.escuela || 'la institución') + '<br>' +
                    (config.tecnicatura || '') + ' - ' + (config.ciudad || '') + ', ' + (config.provincia || '');
            });
        }

        try {
            var res = await fetch(App.utils.dataUrl('data/equipo.json'));
            var integrantes = await res.json();

            var grupos = {};
            integrantes.forEach(function(m) {
                if (!grupos[m.area]) grupos[m.area] = [];
                grupos[m.area].push(m);
            });

            var areas = [];
            try {
                var resProyecto = await fetch(App.utils.dataUrl('data/proyecto.json'));
                var proyecto = await resProyecto.json();
                var seccion = proyecto.sections.filter(function(s) { return s.id === 'como-trabajamos'; })[0];
                if (seccion && seccion.areas) {
                    seccion.areas.forEach(function(a) {
                        if (grupos[a.nombre]) areas.push(a.nombre);
                    });
                }
            } catch (e) {}

            Object.keys(grupos).forEach(function(a) {
                if (areas.indexOf(a) === -1) areas.push(a);
            });

            container.innerHTML = areas.map(function(area) {
                var miembros = grupos[area];
                var cards = miembros.map(function(m) {
                    var inicial = m.nombre.charAt(0).toUpperCase();
                    return '<div class="team-card">' +
                        '<div class="team-avatar">' + inicial + '</div>' +
                        '<h3>' + m.nombre + '</h3>' +
                        '<span class="team-rol">' + m.cargo + '</span>' +
                        '</div>';
                }).join('');

                return '<div class="team-group">' +
                    '<h3 class="team-group-title">' + area + '</h3>' +
                    '<div class="team-list">' + cards + '</div>' +
                    '</div>';
            }).join('');
        } catch (e) {
            container.innerHTML = '<p style="color:#90caf9;">No se pudo cargar el equipo.</p>';
        }
    }

    if (document.getElementById('equipo-container')) {
        render();
    }
})();
