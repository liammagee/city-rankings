
// node samples/sample.js
var fs = require('fs');

var encodings = JSON.parse(fs.readFileSync(__dirname+'/../public/data/encodings.json', 'utf-8'));

for (var key in encodings) {
    if (encodings.hasOwnProperty(key)) {
        if (encodings[key].results && encodings[key].results.length > 0) {
            console.log(key + ':' + encodings[key].results[0].geometry.location.lat +', ' + encodings[key].results[0].geometry.location.lng)
        }
    }
}
