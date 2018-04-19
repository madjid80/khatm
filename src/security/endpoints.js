var User = require(__dirname+'/security/user.js')
module.exports.create = async function(req, res){
  try{
    var user = new User(); 
    user.fromJson(req.body);
    if(await user.checkExistance()){
      throw new Error("User Exist")
    }
    if(user.hasMobile()){
      user.sendMobileVerficationCode(); 
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
      user.sendMobileVerficationCode(); 
    }else if (user.hasEmail()){
      user.sendEmailVerificationCOde(); 
    } 
    res.status(200).send("verification code send")
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.tokenVerification = function(req, res){
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
    res.status(200).send(user.toJson())
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(401).send(e)
  }
}
module.exports.getUser = function(req, res){
  try{
    var user = new User(); 
    //check for ID 
    user.fromJson(req.body);
    await user.restore();
    res.status(200).send(user.toJson())
  }catch(e){
    global.log.error("an error rised form user creation: ", e)
    res.status(401).send(e)
  }
}
module.exports.modifyUSer = function(req, res){}
module.exports.tokenCheck = function(token){

}
