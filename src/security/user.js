var randtoken = require('rand-token');
var db = require(__dirname+'/../utility/mongo.js')
var User = function(){
  this.id = "";
  this.phone = null; 
  this.email = null; 
  this.ip = null;
  this.country = "IRI";
  this.isActive = false;  
  this.created_at = (new Date()).getTime(); 
}
User.prototype.fromJson = function (obj){
  if(obj.hasOwnProperty("phone")){
    this.phone = obj.phone
  }
  if(obj.hasOwnProperty("email")){
    if(this.validateEmail(obj.email){
      this.email = obj.email; 
    }else{
      throw new Error("email is not validate: ",obj.email)
    }
  }
  if(obj.hasOwnProperty("ip")){
    this.ip = obj.ip
  }

  if(obj.hasOwnProperty("id")){
    this.id = obj.id
  }else if(obj.hasOwnPropery("_id")){
    this.id = obj._id.toString()
  }
  if(this.phone == null && 
     this.email == null && 
     this.ip == null ){
    throw new Error("one of main information missing")
  }
}
User.prototype.toJson = function(){
  return {
    id: this.id,
    phone: this.phone, 
    email: this.email, 
    ip: this.ip, 
    country: this.country,
    isActive: this.isActive,
    created_at: this.created_at
  }
}
User.prototype.dbOut= function(){
  return {
    phone: this.phone, 
    email: this.email, 
    ip: this.ip, 
    country: this.country,
    isActive: this.isActive,
    created_at: this.created_at
  }
}
User.prototype.store = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  this.created_at = (new Date()).getTime();

  var result = await db.InsertManyDB([this.DbOut()], 'user');
  this.id = result[0]._id.toString();
}
User.prototype.restore = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find')
  }
  var filter = {}
  if(this.id.length > 0 ){
    filter = {"_id": db.ObjectId(this.id)}
  }else if(this.hasMobile()){
    filter= {"phone":this.phone};
  }else if(this.hasEmail()){
    filter= {"email":this.phone};
  }
  let temp = await db.GetSpecificFromDB(filter, 'user', filters);
  if(temp.length){
    this.fromJson(temp[0].docs);
  }else{
    throw new Error("There isnt any campaign with this id");
  }
}
User.prototype.sendMobileVerificationCode = async function(){
  var tokendigit = randtoken.generator({chars: '0-9'})
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  var mobileCode = {}
  mobileCode.created_at = (new Date()).getTime();
  mobileCode.token = tokendigit.generate(5);
  mobileCode.phone = this.phone; 
  await db.InsertManyDB([mobileCode], 'phoneToken');

}
User.prototype.sendEmailVerificationCode = async function(){

}
User.prototype.checkMobileVerificationCode = async function(code){

}
User.prototype.checkEmailVerificationCode = async function(code){

}
User.prototype.hasMobile = function(){
  return this.phone != null && this.phone.length> 9 ; 
}
User.prototype.hasEmail = function(){
  return this.email != null && this.email.length > 3;
}
User.prototype.validateEmail = function(email){
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        global.log.error("Not a valid e-mail address");
        return false;
    }
}
User.prototype.checkExistance = async function(){
  var filters= {}; 
  let filterMobileEmail = {}; 
  if(this.hasMobile() && this.hasEmail()){
    filterMobileEmail = {"$or":[{"phone":this.phone},{"email":this.email}]};
  }else if(this.hasMobile()){
    filterMobileEmail = {"phone":this.phone};
  }else if(this.hasEmail()){
    filterMobileEmail = {"email":this.phone};
  }
  filters = {"$and":[ {"isActive":true} , filterMobileEmail ]}
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  var users = await db.findAllFromDb(filters, "user"); 
  global.log.debug("User which find from DB Is: ", users)
  return users.length  
}
User.prototype.checkVerificationCode = async function(code){
  if(this.hasMobile()){
    return await this.checkMobileVerificationCode(code)
  }else if(this.hasEmail()){
    return await this.checkEmailVerificationCode(code)
  } 
}
module.exports = User; 
