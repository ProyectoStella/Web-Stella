(function() {
    var container = document.getElementById('footer');
    if (!container) return;

    App.cargarConfig().then(function(config) {
        if (!config) return;

        var inPages = App.utils.isInPages();

        var footer = document.createElement('footer');
        footer.className = 'site-footer';

        var top = document.createElement('div');
        top.className = 'footer-top';

        var marcaCol = document.createElement('div');
        marcaCol.className = 'footer-col';
        var marca = document.createElement('div');
        marca.className = 'footer-marca';
        var logo = document.createElement('img');
        logo.className = 'footer-logo';
        logo.alt = '';
        logo.src = App.utils.dataUrl(config.logo || 'assets/logos/default-logo.svg');
        logo.loading = 'lazy';
        var nombre = document.createElement('span');
        nombre.textContent = config.nombre_proyecto || 'STELLA';
        marca.appendChild(logo);
        marca.appendChild(nombre);
        var lema = document.createElement('p');
        lema.className = 'footer-lema';
        lema.textContent = config.lema || '';
        marcaCol.appendChild(marca);
        marcaCol.appendChild(lema);

        var navCol = document.createElement('div');
        navCol.className = 'footer-col';
        var navTitulo = document.createElement('h4');
        navTitulo.textContent = 'Secciones';
        navCol.appendChild(navTitulo);
        var navLista = document.createElement('ul');
        navLista.className = 'footer-links';
        App.constants.NAV_PAGES.forEach(function(p) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            if (p.file === 'index.html') {
                a.href = inPages ? '../index.html' : 'index.html';
            } else {
                a.href = inPages ? p.file : 'pages/' + p.file;
            }
            a.textContent = p.label;
            li.appendChild(a);
            navLista.appendChild(li);
        });
        navCol.appendChild(navLista);

        var contactoCol = document.createElement('div');
        contactoCol.className = 'footer-col';
        var contTitulo = document.createElement('h4');
        contTitulo.textContent = 'Contacto';
        contactoCol.appendChild(contTitulo);
        if (config.correo) {
            var mail = document.createElement('a');
            mail.className = 'footer-mail';
            mail.href = 'mailto:' + config.correo;
            mail.textContent = config.correo;
            contactoCol.appendChild(mail);
        }
        var ver = document.createElement('div');
        ver.className = 'footer-version';
        ver.textContent = (config.version_actual || '') + ' · ' + config.anio_inicio;
        contactoCol.appendChild(ver);

        top.appendChild(marcaCol);
        top.appendChild(navCol);
        top.appendChild(contactoCol);

        var redes = document.createElement('div');
        redes.className = 'redes';
        var sociales = config.redes_sociales || {};
        Object.keys(sociales).forEach(function(key) {
            var red = sociales[key];
            if (!red.url || !red.icono) return;
            var a = document.createElement('a');
            a.href = red.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.setAttribute('aria-label', key);
            var img = document.createElement('img');
            img.src = App.utils.dataUrl(red.icono);
            img.alt = key;
            img.loading = 'lazy';
            a.appendChild(img);
            redes.appendChild(a);
        });

        var copy = document.createElement('div');
        copy.className = 'footer-copy';
        var anio = new Date().getFullYear();
        var plantilla = config.copyright || '© {year} {nombre_proyecto} - {escuela}';
        copy.textContent = plantilla
            .replace('{year}', anio)
            .replace('{nombre_proyecto}', config.nombre_proyecto || '')
            .replace('{escuela}', config.escuela || '');

        footer.appendChild(top);
        footer.appendChild(redes);
        footer.appendChild(copy);
        container.appendChild(footer);
    }).catch(function() {
        var footer = document.createElement('footer');
        var p = document.createElement('p');
        p.textContent = '© ' + new Date().getFullYear() + ' STELLA';
        footer.appendChild(p);
        container.appendChild(footer);
    });
})();
