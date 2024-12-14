$('document').ready(function () {

    var map1 = L.map('map1',{scrollWheelZoom: true}).setView([48.857, 2.327], 12);
    map1.setMaxBounds(map1.getBounds());
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 11,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxBounds: [
            [0.712, -74.227],
    
            [0.774, -74.125]
            ],
    }).addTo(map1);

    var parisicon = L.icon({
        iconUrl: 'Images/franceflag.png',
        iconSize:     [65, 65], 
        iconAnchor:   [34, 40], 
        popupAnchor:  [-3, -36] 
    })

    var paris = L.marker([48.857, 2.347],{icon: parisicon}).addTo(map1);
    paris.bindPopup("<b>2024 Olympic Games!</b>").openPopup();
    L.marker([48.858, 2.295]).bindTooltip("Eiffel Tower Stadium", {direction: 'top'}).addTo(map1);
    L.marker([48.845, 2.253]).bindTooltip("Roland Garros Stadium", {direction: 'top'}).addTo(map1);
    L.marker([48.841, 2.254]).bindTooltip("Parc des Princes Stadium", {direction: 'top'}).addTo(map1);
    L.marker([48.855, 2.299]).bindTooltip("Champ de Mars Arena", {direction: 'top'}).addTo(map1);
    L.marker([48.859, 2.292]).bindTooltip("Pont d'Iéna", {direction: 'top'}).addTo(map1);
    L.marker([48.856, 2.313]).bindTooltip("Invalides", {direction: 'top'}).addTo(map1);
    L.marker([48.864, 2.314]).bindTooltip("Pont Alexandre III", {direction: 'top'}).addTo(map1);
    L.marker([48.866, 2.313]).bindTooltip("Grand Palais", {direction: 'top'}).addTo(map1);
    L.marker([48.866, 2.323]).bindTooltip("Place le la Concorde", {direction: 'top'}).addTo(map1);
    L.marker([48.861, 2.354]).bindTooltip("Hôtel de Ville", {direction: 'top'}).addTo(map1);
    L.marker([48.898, 2.360]).bindTooltip("Porte de la Chapelle Arena", {direction: 'top'}).addTo(map1);
    L.marker([48.842, 2.390]).bindTooltip("Bercy Arena", {direction: 'top'}).addTo(map1);

    var louvreicon = L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Louvre_Museum_icon_1.svg/550px-Louvre_Museum_icon_1.svg.png',
        iconSize:     [65, 45], 
        iconAnchor:   [34, 40], 
        popupAnchor:  [-3, -36] 
    })
    L.marker([48.861, 2.337],{icon: louvreicon}).addTo(map1);

    var eiffelicon = L.icon({
        iconUrl: 'https://www.pngkey.com/png/full/958-9587356_paris-torre-eiffel-eiffel-tower.png',
        iconSize:     [50, 85], 
        iconAnchor:   [34, 40], 
        popupAnchor:  [-3, -36] 
    })
    L.marker([48.858, 2.295],{icon: eiffelicon}).addTo(map1);
    
    var arcdotriunfo = L.icon({
        iconUrl: 'https://assets.stickpng.com/images/580b585b2edbce24c47b2d60.png',
        iconSize:     [70, 65], 
        iconAnchor:   [34, 40], 
        popupAnchor:  [-3, -36] 
    })
    L.marker([48.876, 2.300],{icon: arcdotriunfo}).addTo(map1);



    var map3 = L.map('map3', {scrollWheelZoom: true}).setView([46.857, 2.347], 5);
    map3.setMaxBounds(map3.getBounds());
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 6,
        minZoom:4,
        maxBounds: [
            [0.712, -74.227],
    
            [0.774, -74.125]
            ],
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map3);

    L.marker([44.999, -0.334]).bindTooltip("Bordeaux Stadium", {direction: 'top'}).addTo(map3);
    L.marker([47.342, -1.135]).bindTooltip("Stade de la Beaujoire", {direction: 'top'}).addTo(map3);
    L.marker([46.985, 2.248]).bindTooltip("Centre National de Tir Sportif", {direction: 'top'}).addTo(map3);
    L.marker([50.612, 3.131]).bindTooltip("Stade Pierre-Mauroy", {direction: 'top'}).addTo(map3);
    L.marker([45.771, 5.0]).bindTooltip("Parc Olympique Lyonnais", {direction: 'top'}).addTo(map3);
    L.marker([45.479, 4.499]).bindTooltip("Stade Geoffroy-Guichard", {direction: 'top'}).addTo(map3);
    L.marker([43.705, 7.194]).bindTooltip("Nice Stadium", {direction: 'top'}).addTo(map3);
    L.marker([43.269, 5.396]).bindTooltip("Marseille Stadium", {direction: 'top'}).addTo(map3);

    });

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
        })
    }


    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
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


$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
    