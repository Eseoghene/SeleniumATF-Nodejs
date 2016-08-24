
//running singe file. Figure out running suite
var fs = require('fs');
var path = require('path');
var execFile = process.cwd();
var execFileName = 'automate/tests/testing';

//var execFileName=path.dirname(execFile);
var dir = path.dirname(execFile);
 var configFileName = dir + path.sep + execFileName+ path.sep +'objects.json' ;


var confData = {};
console.log('execFile: '+process.argv)
console.log('execFilename: '+execFileName)
try{
	confData = fs.readFileSync(configFileName, 'utf8');
}
catch(e){
	throw e;
}



if (confData) {
	// console.log(confData);
 confData = JSON.parse(confData);
	 //console.log(confData);
}
module.exports={
		confData:confData

}
