var randtoken = require('rand-token');
var db = require(__dirname+'/../utility/mongo.js')
var request = require(__dirname+'/../utility/requests.js')
var User = function(){
  this.id = "";
  this.phone = null; 
  this.email = null; 
  this.ip = null;
  this.country = "IRI";
  this.isActive = false;  
  this.created_at = (new Date()).getTime(); 
  this.accessToken = null
}
User.prototype.fromJson = function (obj){
  if(obj.hasOwnProperty("phone")){
    this.phone = obj.phone
  }
  if(obj.hasOwnProperty("email") && obj.email){
    if(this.validateEmail(obj.email)){
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
  }else if(obj.hasOwnProperty("_id")){
    this.id = obj._id.toString()
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
    created_at: this.created_at,
    accessToken: this.accessToken
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

  var result = await db.InsertManyDB([this.dbOut()], 'user');
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
  }else if(this.accessToken){
    filter = {"accessToken": this.accessToken}
  }else{
    throw new Error("There isnt any campaign with this id");
  }
  let temp = await db.GetSpecificFromDB(filter, 'user', {});
  if(temp.length){
    this.fromJson(temp[0].docs);
  }else{
    throw new Error("There isnt any campaign with this id");
  }
}
User.prototype.sendMobileVerificationCode = async function(){
  try{
  var tokendigit = randtoken.generator({chars: '0-9'})
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  var time = new Date(); 
  time.setMinutes(time.getMinutes()-5);
  var filter = {"$and":[{"phone": this.phone}, {"created_at":{"$gt":time.getTime()}}]}
  var token = await db.FindAllFromDB(filter, "phoneToken"); 
  global.log.debug("tokens which available is :",token)
  if(token.length > 0 ) {
    throw new Error("verification code already have sent")
  }
  var mobileCode = {}
  mobileCode.created_at = (new Date()).getTime();
  mobileCode.token = tokendigit.generate(5);
  mobileCode.phone = this.phone; 
  await db.InsertManyDB([mobileCode], 'phoneToken');
  await request.postRequest(
    "https://api.kavenegar.com/v1/"+
    process.env.KNAPI+
    "/verify/lookup.json"+
    "?"+
    "receptor="+this.phone+
    "&token="+mobileCode.token.toString()+
    "&template=forghanverify",{},{}) 
  }catch(e){
    global.log.error("there is an error in verification  mobile: ", e)
    throw e
  }
}
User.prototype.sendEmailVerificationCode = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  var time = new Date(); 
  time.setMinutes(time.getMinutes()-60);
  var filter = {"$and":[{"email": this.email}, {"created_at":{"$gt":time.getTime()}}]}
  var token = await db.FindAllFromDB(filter, "emailToken"); 
  global.log.debug("tokens which available is :",token)
  if(token.length > 0 ) {
    throw new Error("verification code already have sent")
  }
  var emailCode = {}
  emailCode.created_at = (new Date()).getTime();
  emailCode.token = randtoken.generate(10);
  emailCode.email = this.email; 
  await db.InsertManyDB([emailCode], 'emailToken');
  

}
User.prototype.checkMobileVerificationCode = async function(code){
  var time = new Date(); 
  time.setMinutes(time.getMinutes()-5);
  var filter = {"$and":[{"phone": this.phone}, {"token":code}, {"created_at":{"$gt":time.getTime()}}]}
  var token = await db.FindAllFromDB(filter, "phoneToken"); 
  global.log.debug("mobile verification code which found are: ", token)
  return token.length
}
User.prototype.checkEmailVerificationCode = async function(code){
  var time = new Date(); 
  time.setMinutes(time.getMinutes()-5);
  var filter = {"$and":[{"email": this.email}, {"token":code}, {"created_at":{"$gt":time.getTime()}}]}
  var token = await db.FindAllFromDB(filter, "emailToken"); 
  global.log.debug("email verification code which found are: ", token)
  return token.length
}
User.prototype.hasMobile = function(){
  return this.phone != null && this.phone.length> 9 ; 
}
User.prototype.hasEmail = function(){
  return this.email != null && this.email.length > 3;
}
User.prototype.validateEmail = function(email){
    if(!email){
      return false;
    }
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
    filterMobileEmail = {"email":this.email};
  }else{
    return false; 
  }
  filters = {"$and":[ filterMobileEmail ]}
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  var users = await db.FindAllFromDB(filters, "user"); 
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
User.prototype.GenerateAccessToken = async function(){
  this.accessToken = randtoken.generate(40);
  this.isActive = true ;
  await db.UpdateDB({ _id: db.ObjectId(this.id)  }, 
    { "$set":{"accessToken": this.accessToken, "isActive":true}},'user')
}
module.exports = User; 
