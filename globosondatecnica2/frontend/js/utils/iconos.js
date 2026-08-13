var App = window.App || {};
App.iconos = (function() {
    var iconos = {
        objetivo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
        ascenso: '<path d="M12 20V4"/><path d="M5.5 10.5L12 4l6.5 6.5"/>',
        descenso: '<path d="M12 4v16"/><path d="M5.5 13.5L12 20l6.5-6.5"/>',
        reloj: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/>',
        ubicacion: '<path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
        globo: '<path d="M12 3c-4 0-6.5 2.6-6.5 6a6.3 6.3 0 0 0 3.8 5.7c.5.2.7.7.7 1.2V17a2 2 0 0 0 4 0v-1.1c0-.5.2-1 .7-1.2A6.3 6.3 0 0 0 18.5 9c0-3.4-2.5-6-6.5-6z"/><path d="M12 17v4"/>',
        caja: '<path d="M4 7.5l8-4 8 4v9l-8 4-8-4v-9z"/><path d="M4 7.5l8 4 8-4"/><path d="M12 11.5v9"/>',
        personas: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 15.2a4.5 4.5 0 0 1 4.5 4.3"/>',
        archivos: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="9" width="16" height="6" rx="1.5"/><rect x="4" y="15" width="16" height="6" rx="1.5"/>',
        documento: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 16h5"/>',
        engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>',
        monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21h6M12 17v4"/>',
        antena: '<path d="M4.5 4.5a11 11 0 0 1 15 0"/><path d="M8 9a6 6 0 0 1 8 0"/><circle cx="12" cy="14" r="2.2"/><path d="M12 16v5"/>',
        paleta: '<path d="M12 3a9 9 0 1 0 0 18h1.5a1.7 1.7 0 0 0 1.2-2.9 1.7 1.7 0 0 1 1.2-2.9H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3z"/><circle cx="8" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="9" r="1" fill="currentColor" stroke="none"/>',
        satelite: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#0a0a1a" stroke="#0a0a1a"/>',
        paracaidas: '<path d="M12 3a9 9 0 0 1 9 9c0 1.6-2.5 2.6-4 1.5-1.4 1-3.6 1-5 0-1.4 1-3.6 1-5 0-1.5 1.1-4 .1-4-1.5a9 9 0 0 1 9-9z"/><path d="M12 12v9"/>',
        video: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10l6-3v10l-6-3"/>',
        disco: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M5 6h14v4H9V6"/><rect x="9" y="14" width="6" height="4" rx="0.5"/>',
        mapa: '<path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2z"/><path d="M9 4v14M15 6v14"/>',
        mundo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18z"/>',
        explosion: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/>',
        portapapeles: '<rect x="5" y="6" width="14" height="15" rx="2"/><path d="M9 6V4h6v2"/><path d="M9 12h6M9 16h6"/>'
    };

    var mapa = {
        '🎯': 'objetivo',
        '⬆️': 'ascenso',
        '⬇️': 'descenso',
        '⏰': 'reloj',
        '📍': 'ubicacion',
        '🎈': 'globo',
        '📦': 'caja',
        '👥': 'personas',
        '🗂️': 'archivos',
        '📄': 'documento',
        '🔧': 'engranaje',
        '🖥️': 'monitor',
        '📡': 'antena',
        '🎨': 'paleta',
        '🛰️': 'satelite',
        '🪂': 'paracaidas',
        '📹': 'video',
        '💾': 'disco',
        '🗺️': 'mapa',
        '🌍': 'mundo',
        '💥': 'explosion',
        '📋': 'portapapeles'
    };

    function svg(nombre) {
        var cuerpo = iconos[nombre];
        if (!cuerpo) return '';
        return '<svg class="icono-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + cuerpo + '</svg>';
    }

    function desdeEmoji(emoji) {
        var nombre = mapa[emoji] || mapa[emoji.replace(/\uFE0F/g, '')];
        if (!nombre) return emoji;
        return svg(nombre);
    }

    return {
        svg: svg,
        desdeEmoji: desdeEmoji
    };
})();
