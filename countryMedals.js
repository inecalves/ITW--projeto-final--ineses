// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals');
    self.displayName = 'Paris 2024 Country Medals';
    self.records = ko.observableArray([]);
    //adicionado a partir daqui
    self.Countries = ko.observable(92);
    self.Order = ko.observable();

    // Variáveis para o gráfico
    var countryNames = [];
    var goldMedals = [];
    var silverMedals = [];
    var bronzeMedals = [];

    // Função principal para carregar dados
    self.activate = function () {
        console.log('CALL: getCountryMedals...');
        var composedUri = self.baseUri() + "?Countries=" + self.Countries() + (self.Order() ? "&Order=" + self.Order() : "");;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);

            // Processar dados para o gráfico
            countryNames = data.map(item => item.CountryName);
            goldMedals = data.map(item => item.GoldMedal);
            silverMedals = data.map(item => item.SilverMedal);
            bronzeMedals = data.map(item => item.BronzeMedal);

            // Criar o gráfico
            createMedalsChart();
        });
    };

    // Função para AJAX
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                alert("AJAX Call[" + uri + "] Fail...");
            }
        });
    }

    // Função para atualizar a ordem
    self.setOrder = function (orderValue) {
        console.log(`Setting order to: ${orderValue}`);
        self.Order(orderValue); // Atualiza o observable Order
        self.activate();        // Chama a função activate para recarregar os dados
    };

    
    // Função para criar o gráfico com Chart.js
    function createMedalsChart() {
        let ctx = document.getElementById('medalsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countryNames,
                datasets: [
                    {
                        label: 'Gold 🥇',
                        data: goldMedals,
                        backgroundColor: '#FFD700'
                    },
                    {
                        label: 'Silver 🥈',
                        data: silverMedals,
                        backgroundColor: '#C0C0C0'
                    },
                    {
                        label: 'Bronze 🥉',
                        data: bronzeMedals,
                        backgroundColor: '#CD7F32'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Medal Count by Country'
                    }
                }
            }
        });
    }

    // Inicializar
    self.activate();
    console.log("VM initialized!");
};

// Inicializar o Knockout.js
$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});
