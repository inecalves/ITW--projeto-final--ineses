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
        localStorage.setItem("fav4", JSON.stringify(self.favourites()));
    };

    self.setFavourites = function () {
        const storedFavourites = JSON.parse(localStorage.getItem("fav4"));
        if (Array.isArray(storedFavourites)) {
            self.favourites(storedFavourites);
        }
    };

    //Barra de pesquisa
    $(document).ready(function () {
        const api_url = "http://192.168.160.58/Paris2024/api/Sports/Search";
    
        function executeSearch() {
            const searchTerm = $('#procura').val().toLowerCase();
    
            if (searchTerm.length >= 3) {
                $.ajax({
                    type: "GET",
                    url: api_url,
                    data: {
                        q: searchTerm
                    },
                    success: function (data) {
                        if (!data.length) {
                            alert('Sem resultados para: ' + searchTerm);
                        } else {
                            // Redirecione para os detalhes do primeiro resultado, por exemplo:
                            const firstResult = data[0];
                            window.location.href = "./sportsDetails.html?id=" + firstResult.Id;
                        }
                    },
                    error: function () {
                        alert("Erro na pesquisa!");
                    }
                });
            } else {
                alert("Por favor, insira pelo menos 3 caracteres para pesquisar.");
            }
        }
    
        // AutoComplete com sugestão
        $("#procura").autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    type: "GET",
                    url: api_url,
                    data: {
                        q: request.term.toLowerCase()
                    },
                    success: function (data) {
                        if (!data.length) {
                            response([{ label: 'Sem resultados', value: null }]);
                        } else {
                            response($.map(data.slice(0, 5), function (value) {
                                return {
                                    label: value.Name,
                                    value: value.Id
                                };
                            }));
                        }
                    },
                    error: function () {
                        alert("Erro ao buscar sugestões!");
                    }
                });
            },
            select: function (event, ui) {
                event.preventDefault();
                $("#procura").val(ui.item.label);
                if (ui.item.value) {
                    window.location.href = "./sportsDetails.html?id=" + ui.item.value;
                }
            },
            focus: function (event, ui) {
                $("#procura").val(ui.item.label);
            }
        });
    
        // Acionar pesquisa ao clicar no botão
        $('#searchButton').on('click', function () {
            executeSearch();
        });
    
        // Acionar pesquisa ao pressionar "Enter" na barra de pesquisa
        $('#procura').on('keypress', function (e) {
            if (e.which === 13) {
                executeSearch();
            }
        });
    });

    // Inicializar ViewModel
    self.setFavourites();
    self.activate(1);
};

// Inicializar o Knockout.js
$(document).ready(function () {
    console.log("Ready!");
    ko.applyBindings(new vm());
});
