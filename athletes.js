// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Athletes');
    self.displayName = 'Paris2024 Athletes List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.athletes = ko.observableArray([]);
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
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.athletes(data.Athletes);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalAhletes);
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
        const api_url = "http://192.168.160.58/Paris2024/api/Athletes/Search";
    
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
                            window.location.href = "./athletesDetails.html?id=" + firstResult.Id;
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
                    window.location.href = "./athletesDetails.html?id=" + ui.item.value;
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


    //Favoritos
    self.favourites = ko.observableArray([]);   
        self.toggleFavourite = function (id) {
        if (self.favourites.indexOf(id) == -1) {
            self.favourites.push(id);
        }
        else {
            self.favourites.remove(id);
        }
        localStorage.setItem("fav", JSON.stringify(self.favourites()));
    };

    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("fav"));
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


const currentQueryString = new URLSearchParams(window.location.search);

    
    const currentPage = currentQueryString.get('page') || 1; 
    const currentPageSize = currentQueryString.get('pagesize') || 20; 

    const redirectToAthletes = document.getElementById('redirectToAthletes');
    redirectToAthletes.href = `athletes_faces.html?page=${currentPage}&pagesize=${currentPageSize}`;

//grafico
// Função para buscar estatísticas de gênero e criar o gráfico
async function fetchGenderStatistics() {
    const apiBaseURL = 'http://192.168.160.58/Paris2024/API/Athletes'; // URL da API
    let maleCount = 0;
    let femaleCount = 0;

    try {
        // Fazer a requisição inicial para obter o número total de páginas
        const response = await fetch(`${apiBaseURL}?page=1&pageSize=50`);
        if (!response.ok) {
            throw new Error(`Erro na requisição inicial: ${response.status}`);
        }
        const data = await response.json();
        const totalPages = data.TotalPages;

        console.log("Total de páginas:", totalPages);

        // Iterar por todas as páginas para coletar os dados
        for (let page = 1; page <= totalPages; page++) {
            try {
                const pageResponse = await fetch(`${apiBaseURL}?page=${page}&pageSize=50`);
                if (!pageResponse.ok) {
                    console.warn(`Erro ao buscar a página ${page}: ${pageResponse.status}`);
                    continue; // Pular página em caso de erro
                }
                const pageData = await pageResponse.json();

                // Contar os atletas masculinos e femininos
                pageData.Athletes.forEach(athlete => {
                    if (athlete.Sex.toLowerCase() === 'male') { // Confirmando case-insensitive
                        maleCount++;
                    } else if (athlete.Sex.toLowerCase() === 'female') {
                        femaleCount++;
                    }
                });

                console.log(`Página ${page} processada.`);
            } catch (pageError) {
                console.warn(`Erro ao processar a página ${page}:`, pageError);
                continue; // Continuar para a próxima página
            }
        }

        // Calcular percentagens
        const total = maleCount + femaleCount;
        if (total === 0) {
            throw new Error("Nenhum atleta encontrado para calcular as estatísticas.");
        }
        const malePercentage = ((maleCount / total) * 100).toFixed(2);
        const femalePercentage = ((femaleCount / total) * 100).toFixed(2);

        console.log("Percentagem Masculina:", malePercentage, "%");
        console.log("Percentagem Feminina:", femalePercentage, "%");

        // Criar o gráfico com os dados
        createGenderChart(malePercentage, femalePercentage);

    } catch (error) {
        console.error('Erro ao buscar estatísticas de gênero:', error);
    }
}
