
// node samples/sample.js
var fs = require('fs');
var http = require('http');
var _ = require('underscore');
var RecordsManager = require('../public/javascripts/records_manager.js').RecordsManager;

var records = JSON.parse(fs.readFileSync(__dirname+'/../public/data/catastro.json', 'utf-8'));


var encodings = {}, processed = {}, allKeys = [], analysedRecords = {};


getEncoding = function(key) {
    console.log(key)
    processed[key] = false;
    var options = {
        host: 'maps.googleapis.com',
        post: 80,
        path: '/maps/api/geocode/json?address=' + encodeURIComponent(key) + '&sensor=false'
    }
    var req = http.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk.toString();
        });
        res.on('end', function () {
            encodings[key] = JSON.parse(output);
            processed[key] = true;
            console.log(key ,processed[key])
        });
    })
    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();

}

getEncodings = function() {
    for (var key in analysedRecords) {
        if (analysedRecords.hasOwnProperty(key)) {
            getEncoding(key)
        }
    }
}

RecordsManager.initialiseRecords(records);
var records0 = RecordsManager.analyseRecords(0);
var records1 = RecordsManager.analyseRecords(1);
var records2 = RecordsManager.analyseRecords(2);
_.extend(analysedRecords, records0, records1, records2)
console.log(analysedRecords)
//fs.writeFileSync(__dirname+'/../public/data/all_encodings.json', '', 'utf8');
getEncodings();


var intervalId = null;
checkProcessing = function() {
    var allProcessed = true;
    for (var key in processed) {
        if (processed.hasOwnProperty(key)) {
            if (! processed[key]) {
                allProcessed = false;
                break;
            }
        }
    }
    if (allProcessed) {
        fs.writeFileSync(__dirname+'/../public/data/encodings.json', JSON.stringify(encodings, null, '\t'), 'utf8');
//        for (var key in encodings) {
//            if (encodings.hasOwnProperty(key)) {
//                console.log(key + ':' + encodings[key])
//            }
//        }
        clearInterval(intervalId);
    }
}

intervalId = setInterval(checkProcessing, 2500)


//console.log(RecordsManager.analysedRecords)
//console.log(JSON.parse(json))
