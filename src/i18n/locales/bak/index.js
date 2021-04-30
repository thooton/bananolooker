const glob = require('glob');
var fs = require('fs');

glob('./*.json', {}, (err, files)=>{
  for (var i = 0; i < files.length; i++) {
	  var file = files[i];
	  if (file.includes("package")) continue;
	  var data = fs.readFileSync(file);
	  fs.writeFile(file, data, function(err) {
		  
	  });
  }
})