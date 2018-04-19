var User = require(__dirname+'/user.js')
var db = require(__dirname+'/../utility/mongo.js')
module.exports.create = async function(req, res){
  try{
    var user = new User(); 
    user.fromJson(req.body);
    if(await user.checkExistance()){
      throw new Error("User Exist")
    }
    if(user.hasMobile()){
      user.sendMobileVerificationCode();
    }else if (user.hasEmail()){
      user.sendEmailVerificationCOde(); 
    } 
    await user.store()
    res.status(200).send("verification code send")
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.login = async function(req, res){
  try{
    var user = new User(); 
    user.fromJson(req.body);
    await user.restore();
    if(user.hasMobile()){
      user.sendMobileVerificationCode();
    }else if (user.hasEmail()){
      user.sendEmailVerificationCOde(); 
    } 
    res.status(200).send("verification code send")
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.tokenVerification = async function(req, res){
  try{
    var user = new User(); 
    user.fromJson(req.body);
    if(req.body.hasOwnProperty("code")){
      if(await user.checkVerificationCode(req.body.code) == false){
        throw new Error("verification code is not valid")
      }
    }else{
      throw new Error("There is n't any verification code to check")
    }
    await user.restore();
    await user.GenerateAccessToken(); 
    res.set('token',user.accessToken);  
    res.status(200).send(user.toJson())
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(401).send(e)
  }
}
module.exports.getUser = async function(req, res){
  try{
    var user = new User(); 
    if(!req.params.id){
      throw new Error("there isnt any id in request")
    }
    user.id = req.params.id; 
    await user.restore();
    res.status(200).send(user.toJson())
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(401).send(e)
  }
}
module.exports.modifyUser = function(req, res){}
module.exports.tokenCheck = async function(token){
   try{
    var user = new User(); 
    user.accessToken = token; 
    await user.restore();
    return user.toJson();
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    return null
  }
 
}
