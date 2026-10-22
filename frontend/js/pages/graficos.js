var App = window.App || {};
App.graficos = (function() {
    var MAX_PUNTOS = 50;
    var charts = {};
    var buffers = {};

    function crearConfig(titulo, color, fillColor, unidad) {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: titulo + ' (' + unidad + ')',
                    data: [],
                    borderColor: color,
                    backgroundColor: fillColor,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: color,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        display: true,
                        grid: { color: 'rgba(79, 195, 247, 0.08)', display: false },
                        ticks: { color: '#90caf9', font: { size: 10 }, maxTicksLimit: 6 }
                    },
                    y: {
                        grid: { color: 'rgba(79, 195, 247, 0.12)' },
                        ticks: { color: '#90caf9', font: { size: 11 } }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e0f7ff', font: { size: 12 }, boxWidth: 12, padding: 12 }
                    }
                }
            }
        };
    }

    function init() {
        var configs = [
            { id: 'chart-temp', titulo: 'Temperatura', color: '#4fc3f7', fill: 'rgba(79, 195, 247, 0.15)', unidad: '°C' },
            { id: 'chart-pres', titulo: 'Presión', color: '#81c784', fill: 'rgba(129, 199, 132, 0.15)', unidad: 'hPa' }
        ];

        configs.forEach(function(cfg) {
            var el = document.getElementById(cfg.id);
            if (!el) return;

            buffers[cfg.id] = [];
            var config = crearConfig(cfg.titulo, cfg.color, cfg.fill, cfg.unidad);
            charts[cfg.id] = new Chart(el.getContext('2d'), config);
        });
    }

    function horaActual() {
        var d = new Date();
        return ('0' + d.getHours()).slice(-2) + ':' +
               ('0' + d.getMinutes()).slice(-2) + ':' +
               ('0' + d.getSeconds()).slice(-2);
    }

    function agregarPunto(id, valor) {
        if (!charts[id]) return;

        var buf = buffers[id];
        buf.push(valor);
        if (buf.length > MAX_PUNTOS) buf.shift();

        var chart = charts[id];
        var labels = chart.data.labels;
        var data = chart.data.datasets[0].data;

        labels.push(horaActual());
        data.push(valor);

        if (labels.length > MAX_PUNTOS) {
            labels.shift();
            data.shift();
        }

        chart.update('none');
    }

    function actualizar(temperatura, presion) {
        agregarPunto('chart-temp', temperatura);
        agregarPunto('chart-pres', presion);
    }

    document.addEventListener('DOMContentLoaded', init);

    return { actualizar: actualizar };
})();
