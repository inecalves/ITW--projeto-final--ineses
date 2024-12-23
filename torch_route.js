// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //--- Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);
    var map, routeLayer;

    //--- Inicializar o mapa
    function initializeMap() {
        map = L.map('map').setView([48.8566, 2.3522], 6); // Centralizado na França
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        routeLayer = L.layerGroup().addTo(map);
    }

    //--- Adicionar os pontos e a linha ao mapa
    function renderRouteOnMap(data) {
        const coordinates = [];
        routeLayer.clearLayers(); // Limpa camadas anteriores

        data.forEach((point) => {
            // Verifica se Lat e Lon estão presentes
            const latitude = parseFloat(point.Lat);
            const longitude = parseFloat(point.Lon);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                const latLng = [latitude, longitude];
                coordinates.push(latLng);

                // Adicionar marcador
                L.marker(latLng)
                    .addTo(routeLayer)
                    .bindPopup(
                        `<strong>${point.City}</strong><br>${point.Title}<br>${point.Date_start} - ${point.Date_end}`
                    );
            }
        });

        // Adicionar linha conectando os pontos
        if (coordinates.length > 1) {
            L.polyline(coordinates, { color: 'red', weight: 4 }).addTo(routeLayer);
            map.fitBounds(coordinates); // Ajustar o zoom ao percurso
        }
    }

    //--- Page Events
    self.activate = function () {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data); // Preencher a tabela
            renderRouteOnMap(data); // Renderizar o mapa
        });
    };

    //--- Função AJAX para chamadas à API
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Erro ao chamar a API: " + uri);
            },
        });
    }

    //--- Inicializar mapa e dados
    initializeMap();
    self.activate();
    console.log("VM initialized!");
};

// Inicializar o KnockOut.js
$(document).ready(function () {
    console.log("Ready!");
    ko.applyBindings(new vm());
});
