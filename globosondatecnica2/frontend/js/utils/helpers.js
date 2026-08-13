var App = window.App || {};

App.config = null;
App._promesaConfig = null;

App.cargarConfig = function() {
    if (App.config) return Promise.resolve(App.config);
    if (App._promesaConfig) return App._promesaConfig;
    App._promesaConfig = fetch(App.utils.dataUrl('data/config.json') + '?_=' + Date.now(), { cache: 'no-store' }).then(function(r) {
        if (!r.ok) throw new Error('Error al cargar config.json');
        return r.json();
    }).then(function(cfg) {
        App.config = cfg;
        return cfg;
    });
    return App._promesaConfig;
};

App.utils = {
    isInPages: function() {
        return window.location.pathname.indexOf('/pages/') !== -1;
    },

    currentPage: function() {
        return window.location.pathname.split('/').pop() || 'index.html';
    },

    dataUrl: function(path) {
        return this.isInPages() ? '../' + path : path;
    }
};
