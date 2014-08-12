
// node samples/sample.js
var fs = require('fs');
var csv = require('csv');
var json = [];

csv()
    .fromPath(__dirname+'/../public/data/catastro.csv', {
        columns: true
    })
//    .toPath(process.stdout)
//    .toPath(__dirname+'/../public/catastro.json')
    .transform(function(data){
        //data.unshift(data.pop());
        var jsonRow = {};

        // Provincia
        jsonRow.p_5 = data['p.5'];

        // Partido/Municipio/Departamento
        jsonRow.p_6 = data['p.6'];

        // Código de Partido
        jsonRow.p_6b = data['p.6.b'];

        // Localidad
        jsonRow.p_7 = data['p.7'];

        // Nombre del barrio
        jsonRow.p_8 = data['p.8'];

        // Otros nombres con que se conoce el barrio
        jsonRow.p_9 = data['p.9'];

        // Acceso al sistema de eliminación de excretas por red cloacal
        jsonRow.p_30_1 = data['p.30.1'];

        // Desague a cámara séptica y pozo ciego
        jsonRow.p_30_2 = data['p.30.2'];

        // Desague sólo a pozo negro/ ciego u hoyo, excavación a tierra
        jsonRow.p_30_3 = data['p.30.3'];

        // Otro
        jsonRow.p_30_4 = data['p.30.4'];

        // Acceso al sistema de agua potable a través de agua corriente (red pública)
        jsonRow.p_31_1 = data['p.31.1'];

        // Acceso al agua a través de perforación/pozo
        jsonRow.p_31_2 = data['p.31.2'];

        // Acceso al agua través de camión cisterna
        jsonRow.p_31_3 = data['p.31.3'];

        // Conexión clandestina a la red pública
        jsonRow.p_31_4 = data['p.31.4'];

        // Otro
        jsonRow.p_31_5 = data['p.31.5'];

        return jsonRow;
    })
    .on('data',function(data,index){
        json.push(data);
    })
    .on('end',function(count){
        fs.writeFile(__dirname+'/../public/data/catastro.json', JSON.stringify(json));
        //console.log(json)
//        console.log('Number of lines: '+count);
    })
    .on('error',function(error){
        console.log(error.message);
    });
