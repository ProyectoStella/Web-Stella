(function() {
    var container = document.getElementById('navbar');
    if (!container) return;

    var current = App.utils.currentPage();
    var inPages = App.utils.isInPages();

    var header = document.createElement('header');
    var nav = document.createElement('nav');

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    for (var i = 0; i < 3; i++) {
        toggle.appendChild(document.createElement('span'));
    }

    var marca = document.createElement('a');
    marca.className = 'navbar-brand';
    marca.href = inPages ? '../index.html' : 'index.html';
    marca.setAttribute('aria-label', 'STELLA - Inicio');

    var logoImg = document.createElement('img');
    logoImg.className = 'navbar-logo';
    logoImg.alt = '';
    logoImg.width = 28;
    logoImg.height = 28;
    logoImg.fetchPriority = 'high';
    logoImg.decoding = 'async';

    var nombre = document.createElement('span');
    nombre.className = 'navbar-nombre';
    nombre.textContent = 'STELLA';

    marca.appendChild(logoImg);
    marca.appendChild(nombre);
    nav.appendChild(toggle);
    nav.appendChild(marca);

    var ul = document.createElement('ul');
    App.constants.NAV_PAGES.forEach(function(p) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        if (inPages) {
            a.href = p.file === 'index.html' ? '../' + p.file : p.file;
        } else {
            a.href = p.file === 'index.html' ? p.file : 'pages/' + p.file;
        }
        a.textContent = p.label;
        if (current === p.file) {
            a.className = 'active';
            a.setAttribute('aria-current', 'page');
        }
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    header.appendChild(nav);
    container.appendChild(header);

    App.cargarConfig().then(function(config) {
        if (!config) return;
        if (config.nombre_proyecto) nombre.textContent = config.nombre_proyecto;
        if (config.logo) logoImg.src = App.utils.dataUrl(config.logo);
        if (config.favicon) {
            var link = document.querySelector('link[rel="icon"]');
            if (link) link.href = App.utils.dataUrl(config.favicon);
        }
    }).catch(function() {});

    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    function cerrarMenu() {
        ul.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
    }

    toggle.addEventListener('click', function() {
        var abierto = ul.classList.toggle('active');
        toggle.setAttribute('aria-expanded', String(abierto));
        toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    ul.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') cerrarMenu();
    });
})();
