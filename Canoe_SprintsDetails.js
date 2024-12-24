// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Canoe_Sprints/?id=');
    self.displayName = 'Basketballs Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Date = ko.observable('');
    self.EventId = ko.observable('');
    self.EventName = ko.observable('');
    self.StageId = ko.observable('');
    self.StageName = ko.observable('');
    self.Sex = ko.observable('');
    self.Venue = ko.observable('');
    self.ParticipantType = ko.observable('');
    self.ParticipantCode = ko.observable('');
    self.ParticipantName = ko.observable('');
    self.CountryCode = ko.observable('');
    self.CountryName = ko.observable('');
    self.CountryFlag = ko.observable('');
    self.NOCFlag = ko.observable('');
    self.Rank = ko.observable('');
    self.Result = ko.observable('');
    self.ResultType = ko.observable('');
    self.ResultIRM = ko.observable('');
    self.ResultDiff = ko.observable('');
    self.ResultWLT = ko.observable('');
    self.QualificationMark = ko.observable('');
    self.StartOrder = ko.observable('');
    self.Bib = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Date(data.Date);
            self.EventId(data.EventId);
            self.EventName(data.EventName);
            self.StageId(data.StageId);
            self.StageName(data.StageName);
            self.Sex(data.Sex);
            self.Venue(data.Venue);
            self.ParticipantType(data.ParticipantType);
            self.ParticipantCode(data.ParticipantCode);
            self.ParticipantName(data.ParticipantName);
            self.CountryCode(data.CountryCode);
            self.CountryName(data.CountryName);
            self.CountryFlag(data.CountryFlag);
            self.NOCFlag(data.NOCFlag);
            self.Rank(data.Rank);
            self.Result(data.Result);
            self.ResultType(data.ResultType);
            self.ResultIRM(data.ResultIRM);
            self.ResultDiff(data.ResultDiff);
            self.ResultWLT(data.ResultWLT);
            self.QualificationMark(data.QualificationMark);
            self.StartOrder(data.StartOrder);
            self.Bib(data.Bib);
          
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