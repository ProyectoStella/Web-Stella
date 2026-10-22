(function() {
    var fallosConsecutivos = 0;
    var maxFallos = 5;
    var apiUrl = null;

    App.cargarConfig().then(function(config) {
        if (config && config.api_url) apiUrl = config.api_url;
    });

    function mostrarError() {
        var tempEl = document.getElementById('temp');
        var presEl = document.getElementById('presion');
        if (tempEl) tempEl.textContent = '-- °C';
        if (presEl) presEl.textContent = '-- hPa';
    }

    async function obtenerDatos() {
        try {
            var res = await fetch(apiUrl || App.constants.API_URL);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var data = await res.json();

            var tempVal = parseFloat(data.temperatura);
            var presVal = parseFloat(data.presion);
            if (isNaN(tempVal) || isNaN(presVal)) throw new Error('Datos inválidos');

            var tempEl = document.getElementById('temp');
            var presEl = document.getElementById('presion');

            if (tempEl) {
                tempEl.textContent = tempVal.toFixed(1) + ' °C';
                tempEl.style.color = tempVal > 40 ? '#ff5252' : '#4fc3f7';
            }
            if (presEl) {
                presEl.textContent = presVal.toFixed(1) + ' hPa';
            }

            if (App.graficos && App.graficos.actualizar) {
                App.graficos.actualizar(tempVal, presVal);
            }
            fallosConsecutivos = 0;
        } catch (e) {
            fallosConsecutivos++;
            if (fallosConsecutivos >= maxFallos) {
                mostrarError();
            }
        }
    }

    if (document.getElementById('temp') || document.getElementById('presion')) {
        obtenerDatos();
        setInterval(obtenerDatos, 2000);
    }
})();
