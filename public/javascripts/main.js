
var geocoder;

var map, ctaLayer, encodings, markers = [], weightedPoints = [], heatmap;
var rows, values;
var sizeOfHeatIsland;

var     coordindates,
        homicideRates,
        fastestCities, 
        monocleCities, 
        economistCities, 
        mercerCities, 
        richestCities, 
        siemensCities, 
        globalCities, 
        properCities, 
        urbanAreaCities;


// Load the Google map
initializeMap = function() {
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 2,
//        center: new google.maps.LatLng(-34.5976, -58.383),
        center: new google.maps.LatLng(15, 10),
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
}


clearOverlays = function() {
    hideOverlays()
    markers = [];

    hideHeatmap()
    weightedPoints = [];
}

hideOverlays = function() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    })
}
showOverlays = function() {
    markers.forEach(function(marker) {
        marker.setMap(map);
    })
}

hideHeatmap = function() {
    if (heatmap)
        heatmap.setMap(null);
}
showHeatmap = function() {

    // Determine size of heat island
    sizeOfHeatIsland = parseInt($('#heatIsland option:selected').val());

    // Determine opacity of heat island
    opacityOfHeatIsland = parseFloat($('#opacity option:selected').val());

    var pointArray = new google.maps.MVCArray(weightedPoints);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray
        , dissipating: false
        , opacity: opacityOfHeatIsland
        , radius: sizeOfHeatIsland
    });

    heatmap.set('gradient', [
            'rgba(255, 65, 0, 0)',
            'rgba(255, 55, 0, 1)',
            'rgba(255, 45, 0, 1)',
            'rgba(255, 35, 0, 1)',
            'rgba(235, 25, 0, 1)',
            'rgba(215, 15, 0, 1)',
            'rgba(195, 0, 0, 1)',
            'rgba(175, 0, 0, 1)',
            'rgba(155, 0, 0, 1)',
            'rgba(135, 0, 0, 1)',
            'rgba(115, 0, 0, 1)'
          ]);
    heatmap.setMap(map);
}


hookUpListeners = function() {
    $('#showMarkers').click(function() {
        if ($(this).is(':checked')) {
            showOverlays()
        }
        else {
            hideOverlays()
        }
    })

    $('#showHeatmap').click(function() {
        if ($(this).is(':checked')) {
            showHeatmap()
        }
        else {
            hideHeatmap()
        }
    })

    $('#query').click(function() {
        clearOverlays();

        // Determine the right set of results to show
        var showResultsBy = parseInt($('#showResults option:selected').val());
        values = {};
        switch (showResultsBy) {
            case 0:
                values = homicideRates;
                break;
            case 1:
                values = fastestCities;
                break;
            case 2:
                values = monocleCities;
                break;
            case 3:
                values = economistCities;
                break;
            case 4:
                values = mercerCities;
                break;
            case 5:
                values = richestCities;
                break;
            case 6:
                values = siemensCities;
                break;
            case 7:
                values = globalCities;
                break;
            case 8:
                values = properCities;
                break;
            case 9:
                values = urbanAreaCities;
                break;
        }
        var len = _.toArray(values).length + 1;

        // Determine kind of calculation to apply to each value
        var calculateResultsBy = parseInt($('#calculateResults option:selected').val());

        // Add weighted points for the set of values
        _.each(values, function(value, state) {
            var coords = coordindates[state];
            if (coords != null) {
                var myLatlng = new google.maps.LatLng(coords["lat"], coords["lng"]);
                var title = state + ' ranks ' + value + ' out of ' + len  + '.';
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: state + ' ranks ' + value + ' out of ' + len  + '.'
                });
                markers.push(marker);

                weightedValue = len - value;
                switch (calculateResultsBy) {
                    // As is: just N
                    case 0:
                        weightedValue = weightedValue;
                        break;
                    // 2 exp N
                    case 1:
                        weightedValue = Math.pow(2, weightedValue);
                        break;
                    // log(N)
                    case 2:
                        weightedValue = Math.log(weightedValue);
                        break;
                }
                var weightedLocation = {
                    location: myLatlng,
                    weight: weightedValue
                };
                weightedPoints.push(weightedLocation)
            }
        });

        if ($('#showMarkers').is(':checked'))
            showOverlays()
        else
            hideOverlays()
        if ($('#showHeatmap').is(':checked'))
            showHeatmap();
        else
            hideHeatmap();

    })
}

parseCSV = function() {
    $.get('/data/city-rankings.csv', function(csv) {
        var results = $.parse(csv);
        rows = results.results.rows;
        coordindates = {};
        homicideRates = {};
        fastestCities = {};
        monocleCities = {};
        economistCities = {};
        mercerCities = {};
        richestCities = {};
        siemensCities = {};
        globalCities = {};
        properCities = {};
        urbanAreaCities = {};
        _.each(rows, function(row) {
            var city = row['City'];
            var country = row['Country'];
            var lat = row['Lat'];
            var lng = row['Long'];
            var coords = { "lat": lat, "lng": lng }; 
            var homicide = parseInt(row['Homicide']);
            var fastest = parseInt(row['Fastest Growing']);
            var monocle = parseInt(row['Monocle']);
            var economist = parseInt(row['Economist']);
            var mercer = parseInt(row['Mercer']);
            var richest = parseInt(row['Richest Cities']);
            var siemens = parseInt(row['Siemens GCI']);
            var global = parseInt(row['Global Cities Index']);
            var cityProper = parseInt(row['Pop. City Proper']);
            var urbanArea = parseInt(row['Pop. Urban Area']);

            coordindates[city] = coords;
            if (! isNaN(homicide))
                homicideRates[city] = homicide;
            if (! isNaN(fastest))
                fastestCities[city] = fastest;
            if (! isNaN(monocle))
                monocleCities[city] = monocle;
            if (! isNaN(economist))
                economistCities[city] = economist;
            if (! isNaN(mercer))
                mercerCities[city] = mercer;
            if (! isNaN(richest))
                richestCities[city] = richest;
            if (! isNaN(siemens))
                siemensCities[city] = siemens;
            if (! isNaN(global))
                globalCities[city] = global;
            if (! isNaN(cityProper))
                properCities[city] = cityProper;
            if (! isNaN(urbanArea))
                urbanAreaCities[city] = urbanArea;
        });
        //listAddresses();
    });
}

listAddresses = function() {
    _.each(homicideRates, function(rate, city) {
        geocoder.geocode( { 'address': city}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(city + ", " + results[0].geometry.location.toString());
          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
    });
    
}

$(document).ready(function() {
    initializeMap();

    hookUpListeners();

    parseCSV();

});


