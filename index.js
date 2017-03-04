noodle = require('noodlejs')
q = require('q')

baseUrl = "https://minecraft.curseforge.com"

projectUrl = "/projects"

gameVersion = "1738749986%3A5"
filesUrl = "/files?filter-game-version="+gameVersion

var id = process.argv[2]
var requiredType = process.argv[3]

var query = [
  {
    url:baseUrl+projectUrl+"/"+id,
    selector: ".view-on-curse a",
    extract: "href"
  },
  {
    url:baseUrl+projectUrl+"/"+id,
    selector: ".project-title a span",
    extract: "innerHTML"
  },
  {
    url: baseUrl+projectUrl+"/"+id+filesUrl,
    selector: ".project-file-name-container a",
    extract: ["href","innerHTML"]
  }
]
q(noodle.query(query))
.then(function(res){
  files = res.results[2].results
  filePromises = []
  for(file in files){
    filePromises.push(q(noodle.query({
      url:baseUrl+files[file].href,
      selector:".project-file-release-type",
      extract:"class"
    })))
  }
  return q.all(filePromises)
  .then(function(reses){
    project = res.results[0].results[0]
    projectId = project.substring(project.lastIndexOf('/')+1)
    projectName = res.results[1].results[0]
    console.log("Project Name:"+projectName)
    console.log("Project ID: "+projectId)
    for(result in reses){
      file = res.results[2].results[result].href
      fileId = file.substring(file.lastIndexOf('/')+1)
      type = reses[result].results[0].results[0]
      typeId = type.split('-')[2]
      fileName = res.results[2].results[result].innerHTML
      if(requiredType){
        if(typeId==requiredType){
          console.log("File ID: "+fileId);
          console.log("File Name: "+fileName)
          break;
        }
      }else{
        console.log("File Type: "+typeId)
        console.log("File ID: "+fileId)
        console.log("File Name: "+fileName)
      }
    }
  })
})
.fail(function(error){
  console.error(error)
})
.finally(function(){
  noodle.stopCache()
})
