const glob = require('glob');
var fs = require('fs');

glob('./*.json', {}, (err, files)=>{
  for (var i = 0; i < files.length; i++) {
	  var file = files[i];
	  if (file.includes("package")) continue;
	  var data = fs.readFileSync(file);
	  var json = JSON.parse(data);
	  for (var key in json) {
		  for (var subkey in json[key]) {
			 if (typeof json[key][subkey] == 'object') {
				for (var subsubkey in json[key][subkey]) {
					json[key][subkey][subsubkey] = json[key][subkey][subsubkey].replace("NANO", "BAN");
					json[key][subkey][subsubkey] = json[key][subkey][subsubkey].replace("Nano","Banano");
				}
			 } else {
				json[key][subkey] = json[key][subkey].replace("1000 BAN", "10000 BAN");
			 }
		  }
	  }
	  console.log(json);
	  data = JSON.stringify(json, null, 2);
	  fs.writeFile(file, data, function(err) {
		  console.log(err);
	  });
  }
})