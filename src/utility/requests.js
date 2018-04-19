var http = require('http');
var request = require('request');

module.exports.postRequest = async function(url, body, headers,auth){
  var options = { method: 'POST',url: url,auth:auth,headers: headers, body: body,json: true };
  return new Promise((resolve, reject)=>{
    try{
      request(options, function (error, response, body) {
        if (error){
           reject(error);
           return;
        }else if(response.statusCode > 300){
          reject(response.statusCode)
          return 
        }
        global.log.debug("body: ", body);
        resolve(body)
      });
    }catch(e){
      global.log.error(e);
      reject(e);
    }
  });
}
