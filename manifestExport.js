fs = require('fs')
manifest = require(process.argv[2])
files = manifest.files
outputFiles = []
for(i in files){
  file = files[i]
  pid = file.projectID
  fid = file.fileID
  name = file.name
  out = {
    projectID: pid,
    fileId: fid,
    name: name
  }
  outputFiles.push(out)
}

files = manifest.thirdParty
outputThirdParty = []
for(i in files){
  file = files[i]
  url = file.url
  name = file.name
  out = {
    url: url,
    name: name
  }
  outputThirdParty.push(out)
}

newManifest = {
  files: outputFiles,
  thirdParty: outputThirdParty
}

console.log(newManifest)

fs.writeFileSync(process.argv[3],JSON.stringify(newManifest))
