// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Competitions');
    self.displayName = 'Competitions Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    //--- Data Record
    self.SportId = ko.observable('');
    self.Name = ko.observable('');
    self.Tag = ko.observable('');
    self.Photo = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.SportInfo = ko.observableArray([]);

    
    //--- Page Events
    self.activate = function (sportId, Name) {
        var composedUri = self.baseUri() + '?sportId=' + sportId + '&name=' + Name;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.SportId(data.SportId);
            self.Name(data.Name);
            self.Tag(data.Tag);
            self.Photo(data.Photo);
            self.Athletes(data.Athletes);
            self.SportInfo(data.SportInfo);
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
