// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');

    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Teams/');
    self.displayName = 'Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Sex = ko.observable('');
    self.Num_athletes = ko.observable('');
    self.Num_coaches = ko.observable('');

    
    self.Athletes= ko.observableArray([]);
    self.Coaches= ko.observableArray([]);
    self.NOCId = ko.observable('');
    self.NOCName = ko.observable('');
    self.SportId= ko.observable('');
    self.SportName= ko.observable('');
    self.Medals= ko.observableArray([]);    
    self.Medal_Type = ko.observable('');
    self.Sport_name = ko.observable('');
    self.Competition_name = ko.observable('');
    self.Team_Name = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Sex(data.Sex);
            self.Num_athletes(data.Num_Athletes);
            self.Num_coaches(data.Num_Coaches);

            for (let idx = 0; idx < data.Medals.length; idx++) {
                medal = data.Medals[idx]
                switch(medal.Medal_Type) {
                    case 1:
                        data.Medals[idx].Medal_Type = "Gold Medal"
                        break;
                    case 2:
                        data.Medals[idx].Medal_Type = "Silver Medal"
                        break;
                    case 3:
                        data.Medals[idx].Medal_Type = "Bronze Medal"
                        break;
                    default:
                        console.log("Valor desconhecido para Medal_Type");
                }
                
            }

            self.Athletes(data.Athletes);
            self.Coaches(data.Coaches);
            self.NOCId(data.NOC.Id);
            self.NOCName(data.NOC.Name);
            self.SportId(data.Sport.Id);
            self.SportName(data.Sport.Name);
            self.Medals(data.Medals);

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