var fs = require('fs');
var csv = require('csv-streamify');
var config = require('./dataparser');
var testing = require('testing');
var data = config.confData;
/*var readData = [];
var field1 = [];
var field2 = [];
var field3 = [];
var field4 = []; */
module.exports = {
    
	validatefileexists : function(filename) {
		return fs.exists(filename, function(exists) {
			if (exists) {
                            console.log("Test data file found @" + filename);				 
			}
			else {
                            console.log("Test data file NOT found @" + filename);
                            testing.logtoFile("Test data file NOT found @" + filename);
                            browser.quit();
			}
		});
	},

    readDataFromCSV: function (filePath, key) {
        var fstream = fs.createReadStream(filePath)
            .on('err', function (err) {
                console.log("Error getting data from file " + filePath);
                console.log(err);
            });

        var parser = csv({
            objectMode: true, delimiter: ',', empty: ''
        });
        // emits each line as a buffer or as a string representing an array of fields
        parser.on('readable', function () {

            var line = parser.read();
            // console.log("" != line&& line !== null)
            if ("" != line && line !== null) {
                console.log("line= ",line)
                line = line.toString().replace(',', '');
                line = line.toString().replace('\r', '');

                key.push(line);

                //console.log(address.state +">>"+ address.lga+">>>"+address.heavy);
            } else {
                console.log("Empty line found in data");
            }
        });
        parser.on('end', function () {
            //console.log(module.exports.confData['lga_csv']['total_records']);


            console.log("done reading file");
            console.log("Starting test");
            console.log(key)
        });
        // now pump some data into it (and pipe it somewhere else)
        fstream.pipe(parser);

    },
    readmultilineDataFromCSV: function (filePath, key) {
        var fstream = fs.createReadStream(filePath)
            .on('err', function (err) {
                console.log("Error getting data from file " + filePath);
                console.log(err);
            });

        var parser = csv({
            objectMode: true
        });
        // emits each line as a buffer or as a string representing an array of fields
        parser.on('readable', function () {
            //data.address.lga_csv.total_records++;
            var line = parser.read();

            // console.log("" != line&& line !== null)
            if ("" != line && line !== null) {
                line = line.toString().split(',');
                var i = 0;
                var address = key;
                for (var k in address) {
                    if (address[k]) {
                        address[k].push(line[i]);
                        i++;
                    }
                }
                //console.log(address.state +">>"+ address.lga+">>>"+address.heavy);
            } else {
                console.log("Empty line found in data");
            }
        });
        parser.on('end', function () {
            //console.log(module.exports.confData['lga_csv']['total_records']);

            //return false;
            console.log("done reading file");
            console.log("Starting test");
        });
        // now pump some data into it (and pipe it somewhere else)
        fstream.pipe(parser);
    }
}




 