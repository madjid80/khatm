var asyncLib = require("async");
var db = require(__dirname+'/../utility/mongo.js')
var Khatm = require(__dirname+'/khatm.js')

module.exports.create = async function(req, res){
  try{
    var khatm = new Khatm(); 
    req.body.ownerId = req.user.id; 
    khatm.fromJson(req.body);
    await khatm.store(); 
    await khatm.build(); 
    res.status(200).send(khatm.toJson())
  }catch(e){
    global.log.error("an error rised form khatm creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.getAllUserKhatm = async function(req, res){
  try{
    if(!req.user.hasOwnProperty('id')){
      global.log.debug("User: ", req.user)
      throw new Error("There isn't any user", req.user)
    }
    var khatms = await db.FindAllFromDB({"ownerId":req.user.id}, "khatm")
    var khatmsFinal = []
    asyncLib.each(khatms, function(value, callback){
      
      var khatm = new Khatm(); 
      khatm.fromJson(value);
      khatmsFinal.push(khatm.toJson());
      callback();  
    },function(){
      res.status(200).send(khatmsFinal)
    })  
  }catch(e){
    global.log.error("an error rised form khatm creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.getAllFeatures = async function(req, res){
  try{
    var khatms = await db.FindAllFromDB({"isPublic":true}, "khatm")
    var khatmsFinal = []
    asyncLib.each(khatms, function(value, callback){
      
      var khatm = new Khatm(); 
      khatm.fromJson(value);
      khatmsFinal.push(khatm.toJson());
      callback();  
    },function(){
      res.status(200).send(khatmsFinal)
    })  
  }catch(e){
    global.log.error("an error rised form khatm creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.getSpecificKhatm = async function(req, res){
  try{
    if(!req.params.id){
      throw new Error("There is any id in param")
    }
    var khatm = new Khatm(); 
    khatm.id = req.params.id;
    await khatm.restore();
    res.status(200).send(khatm)
  }catch(e){
    global.log.error("an error rised form khatm creation: ", e)
    res.status(400).send(e)
  }
}
module.exports.modifyKhatm= async function(req, res){
  try{
    if(!req.params.id){
      throw new Error("There is any id in param")
    }
    if(!req.body || Object.keys(req.body).length == 0 ){
      throw new Error("There is nt any thing to change")
    }
    var khatm = new Khatm(); 
    khatm.id = req.params.id;
    await khatm.restore();
    khatm.fromJson(req.body);
    await khatm.update(); 
    res.status(200).send(khatm)
  }catch(e){
    global.log.error("an error rised form khatm creation: ", e)
    res.status(400).send(e)
  }
}
