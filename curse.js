noodle = require('noodlejs')
request = require('request')
q = require('q')

function getModDetails(id,version){
  baseUrl = "https://minecraft.curseforge.com"

  projectUrl = "/projects"

  gameVersion = "1738749986%3A5"
  filesUrl = "/files?filter-game-version="+gameVersion
  if(isNaN(id)==false){
    defer = q.defer()
    request(baseUrl+projectUrl+'/'+id,function(err,res,body){
      if(err){
        defer.reject(err)
        return
      }
      console.log(res.request.uri.href)
      defer.resolve(res.request.uri.href)
    })
    result = defer.promise
    return result.then(function(url){
      var id = url.substring(url.lastIndexOf('/')+1)
      console.log(id);
      return getModDetails(id,version);
    })
  }

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
    },
    {
      url: baseUrl+projectUrl+"/"+id+filesUrl,
      selector: ".project-file-release-type div",
      extract: "class"
    }
  ]
  return q(noodle.query(query))
  .then(function(res){
    for(i in res.results[3].results){
      var result = res.results[3].results[i]
      res.results[3].results[i]=result.split('-')[0]
    }
    return q(res)
  })
  .then(function(res){
    var result = {}
    result._original = res
    result.name = res.results[1].results[0]
    result.tag = id
    result.id = Number(res.results[0].results[0].substring(res.results[0].results[0].lastIndexOf('/')+1))
    var files = res.results[2].results
    result.files = []
    for(i in files){
      var file = {}
      file.name = files[i].innerHTML
      file.url = baseUrl + files[i].href
      file.type = res.results[3].results[i]
      result.files.push(file);
    }
    return q(result)
  })
}

function getModDownload(releaseType){
  return function(mod){
    var files = mod.files
    for(i in files){
      var file = files[i]
      if(releaseType){
        if(releaseType==file.type){
          return q(file.url+"/download");
        }
      }else{
        return q(file.url+"/download");
      }
    }
    return q.differed().reject("no file with requested release type")
  }
}

function getProjectID(mod){
  return q(mod.id)
}

function getProjectTag(mod){
  return q(mod.tag)
}

module.exports = {
  getMod: getModDetails,
  getDownloadUrl: getModDownload,
  getProjectTag: getProjectTag,
  getProjectID: getProjectID
}
