// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Competitions');
    self.displayName = 'Competitions Details';
    self.error = ko.observable('');
    self.details = ko.observable({ SportInfo: {}, Athletes: [] });
    
    
    //--- Page Events
    self.activate = function (sportId, name) {
        console.log('CALL: getCompetitionDetails...');
        if (!sportId) {
            console.error('Invalid sportId:', sportId);
            self.error('Invalid sportId provided.');
            return;
        }

        if (!name) {
            console.warn('Name parameter is missing. Defaulting to empty.');
        }

        var composedUri = `${self.baseUri()}?sportId=${sportId}&name=${encodeURIComponent(name || '')}`;
        console.log('Composed URI:', composedUri);
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log("API Response Data:", data);
            self.details(data);
            console.log(details, data);
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

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName;

        console.log('Extracting parameters from URL:', sPageURL);
        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? null : decodeURIComponent(sParameterName[1]);
            }
        }
        console.warn(`Parameter ${sParam} not found in URL.`);
        return null;
    }

    var sportId = getUrlParameter('sportId');
    var name = getUrlParameter('name');

    if (sportId) {
        console.log('Parameters found:', { sportId, name });
        self.activate(sportId, name);
    } else {
        console.error('Parameters missing:', { sportId, name });
        self.error('Missing sportId parameter in the URL.');
    }
    
};

$(document).ready(function () {
    console.log("Document ready, initializing ViewModel...");
    ko.applyBindings(new vm());
});