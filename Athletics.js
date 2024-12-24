// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Athletics');
    self.displayName = 'Paris2024 Athletics Events List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.events = ko.observableArray([]);
    self.eventsFiltrados = ko.observableArray([]);
    
    //--- Page Events

    //--- Para aparecer os dados para o select - endpoint: /Events
    self.getEvents = function () {
        console.log('CALL: getEvents...');
        var composedUri = self.baseUri() + "/Events"
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.events(data);

            // Selecionar automaticamente o primeiro evento se não houver um selecionado
            if (data.length > 0 && !self.selectedEventId()) {
                self.selectedEventId(data[0].EventId); // Substitua por outro EventId se necessário
            }
        });
    };

    //--- EventId selecionado no primeiro <select>
    self.selectedEventId = ko.observable();
    //--- StageId selecionado no segundo <select>
    self.selectedStageId = ko.observable();

    //--- Nome do evento selecionado para exibição
    self.selectedEventName = ko.computed(function() {
        var eventId = self.selectedEventId();
        var event = self.events().find(e => e.EventId === eventId);
        return event ? event.EventName : "Selecione um evento";
    });

    //--- Fases do evento selecionado
    self.stages = ko.computed(function() {
        var eventId = self.selectedEventId();
        var event = self.events().find(e => e.EventId === eventId);
        return event ? event.Stages : [];
    });

    //--- Ir buscar os dados ao endpoint: ?EventId={EventId}&StageId={StageId}
    self.selectedEventId.subscribe(function (newValue) {
        if (newValue) {
            // Pesquisa com EventId e, se disponível, com StageId
            var composedUri = `${self.baseUri()}?EventId=${newValue}&StageId=`;
            if (self.selectedStageId()) {
                composedUri += `&StageId=${self.selectedStageId()}`;
            }
            console.log('CALL: getEventsFiltrados...');
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                self.eventsFiltrados(data);
            });
        }
    });
    
    self.selectedStageId.subscribe(function (newValue) {
        if (newValue && self.selectedEventId()) {
            // Pesquisa específica com EventId e StageId
            var composedUri = `${self.baseUri()}?EventId=${self.selectedEventId()}&StageId=${newValue}`;
            console.log('CALL: getEventsFiltrados...');
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                self.eventsFiltrados(data);
            });
        }
    });
    

    // Inicializar
    self.activate = function () {
        self.getEvents();
    };

    self.activate();

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
});