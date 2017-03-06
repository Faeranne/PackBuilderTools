var curse = require('./curse.js');
var manifest = require(process.argv[2])

if(!manifest.files){
  manifest.files = []
}

//Use q.spread for file processing?
for(i in manifest.files){
  var file = manifest.files;
  var mod = {}
  if(file.curseforgeID){
    mod = curse.getMod(file.curseforgeID)
  }elseif(file.projectID){
    mod = curse.getMod(file.projectID)
  }else{
    console.error("Missing both tag and projectID from a mod. skipping mod");
    continue;
  }
}
