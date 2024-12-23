// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    //--- Variáveis locais
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/sports');
    self.displayName = 'Paris 2024 Sports List';
    self.error = ko.observable('');
    self.sports = ko.observableArray([]);
    self.favourites = ko.observableArray([]);

    // Variáveis para gráficos
    var sportNames = [];
    var athleteCounts = [];
    var teamCounts = [];

    // Função principal para carregar dados
    self.activate = function (id) {
        console.log('CALL: getsports...');
        var composedUri = self.baseUri() + "?page=" + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.sports(data);

            // Processar dados para os gráficos
            sportNames = data.map(item => item.Name);
            athleteCounts = data.map(item => item.Athletes);
            teamCounts = data.map(item => item.Teams);

            // Criar os gráficos
            createPieChart('athletesChart', athleteCounts, sportNames, 'Athletes Proportion');
            createPieChart('teamsChart', teamCounts, sportNames, 'Teams Proportion');
        });
    };

    // Função AJAX Helper
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`AJAX Call[${uri}] failed:`, errorThrown);
            }
        });
    }

    // Função para criar gráficos redondos
    function createPieChart(canvasId, data, labels, title) {
        let ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'pie', // ou 'doughnut' para gráficos em anel
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: generateColors(data.length)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }

    // Função para gerar cores aleatórias
    function generateColors(length) {
        return Array.from({ length }, () => `hsl(${Math.random() * 360}, 70%, 70%)`);
    }

    // Inicializar favoritos
    self.toggleFavourite = function (id) {
        if (self.favourites.indexOf(id) === -1) {
            self.favourites.push(id);
        } else {
            self.favourites.remove(id);
        }
        localStorage.setItem("favourites", JSON.stringify(self.favourites()));
    };

    self.setFavourites = function () {
        const storedFavourites = JSON.parse(localStorage.getItem("favourites"));
        if (Array.isArray(storedFavourites)) {
            self.favourites(storedFavourites);
        }
    };

    // Inicializar ViewModel
    self.setFavourites();
    self.activate(1);
};

// Inicializar o Knockout.js
$(document).ready(function () {
    console.log("Ready!");
    ko.applyBindings(new vm());
});
