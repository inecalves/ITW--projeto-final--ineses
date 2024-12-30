// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Coaches');
    self.displayName = 'Paris2024 Coaches List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.coaches = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.coaches(data.Coaches);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCoaches);
            self.SetFavourites();
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }


    //Barra de pesquisa
    $(document).ready(function () {
        const api_url = "http://192.168.160.58/Paris2024/api/Coaches/Search";
    
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
                            window.location.href = "./coachesDetails.html?id=" + firstResult.Id;
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
                    window.location.href = "./coachesDetails.html?id=" + ui.item.value;
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


    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    function createBarChart(canvasId, data, labels, title) {
        let ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Percentagem',
                    data: data,
                    backgroundColor: ['#ADD8E6', '#FFB6C1'], // Cores para Masculino e Feminino
                    borderColor: ['#ADD8E6', '#FFB6C1'], // Bordas para Masculino e Feminino
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Gráfico horizontal
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: title
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%'; // Adiciona "%" aos valores
                            }
                        }
                    }
                }
            }
        });
    }
    
    function renderGenderChart() {
        const apiUrl = 'http://192.168.160.58/Paris2024/API/Coaches';
        let allCoaches = []; // Para armazenar todos os treinadores
    
        // Função recursiva para buscar todas as páginas
        function fetchAllPages(page = 1) {
            return $.ajax({
                url: `${apiUrl}?page=${page}&pageSize=50`,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    allCoaches = allCoaches.concat(data.Coaches); // Adiciona os treinadores da página atual
                    console.log(`Página ${page} carregada, total atual: ${allCoaches.length} treinadores.`);
    
                    if (data.HasNext) {
                        fetchAllPages(page + 1); // Busca a próxima página
                    } else {
                        processGenderChart(allCoaches); // Quando terminar, processa os dados
                    }
                },
                error: function (error) {
                    console.error("Erro na API:", error);
                }
            });
        }
    
        // Função para calcular e renderizar o gráfico
        function processGenderChart(coaches) {
            console.log("Todos os treinadores:", coaches);
    
            const totalCoaches = coaches.length;
            const maleCount = coaches.filter(coach => coach.Sex.toLowerCase() === 'male').length;
            const femaleCount = coaches.filter(coach => coach.Sex.toLowerCase() === 'female').length;
    
            console.log("Total de Treinadores:", totalCoaches);
            console.log("Masculino:", maleCount, "Feminino:", femaleCount);
    
            const malePercentage = ((maleCount / totalCoaches) * 100).toFixed(1);
            const femalePercentage = ((femaleCount / totalCoaches) * 100).toFixed(1);
    
            console.log("Percentagens -> Masculino:", malePercentage, "Feminino:", femalePercentage);
    
            const chartData = [malePercentage, femalePercentage];
            const chartLabels = ['Masculino', 'Feminino'];
    
            createBarChart('genderChart', chartData, chartLabels, 'Percentagem de Treinadores por Sexo');
        }
    
        // Inicia a busca recursiva a partir da página 1
        fetchAllPages(1);
    }
    
    // Chama a função para renderizar o gráfico após a página carregar
    $(document).ready(function () {
        renderGenderChart();
    });
    


    //Favoritos
    self.favourites = ko.observableArray([]);   
        self.toggleFavourite = function (id) {
        if (self.favourites.indexOf(id) == -1) {
            self.favourites.push(id);
        }
        else {
            self.favourites.remove(id);
        }
        localStorage.setItem("fav2", JSON.stringify(self.favourites()));
    };

    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("fav2"));
        }
        catch (e) {
            ;
        }
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    }


    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})