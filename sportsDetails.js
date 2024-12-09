// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/sports/');
    self.displayName = 'Sport Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Sport_url = ko.observable('');
    self.Pictogram = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.Coaches = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);  // Raw data, possibly with duplicates
    self.Teams = ko.observableArray([]);
    self.Technical_officials = ko.observableArray([]);
    self.Venues = ko.observableArray([]);

    
    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Sport_url(data.Sport_url);
            self.Pictogram(data.Pictogram);
            self.Athletes(data.Athletes);
            self.Coaches(data.Coaches);
            self.Technical_officials(data.Technical_officials);
            self.Venues(data.Venues);
            self.Teams(data.Teams);  // Set Teams array (may contain duplicates)
            self.Competitions(data.Competitions); // Set Competitions array (may contain duplicates)
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

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....  
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("o bacalhau está no forno!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
