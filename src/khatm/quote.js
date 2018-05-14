
var asyncLib = require("async");
var db = require(__dirname+'/../utility/mongo.js')
var Quote = function(){
  this.id = null; 
  this.refrence_khatm = null; 
  this.owner_id = null; 
  this.status = null;
  this.share_status = null;  
  this.time = null; 
  this.start_at = null; 
  this.url = null; 
  this.type = 0; //0 page, 1 hezb, 2 joz, 3 manzil 
}

Quote.prototype.toJson = function (){
  return {
    id: this.id, 
    refrence_khatm: this.refrence_khatm, 
    owner_id: this.owner_id, 
    status: this.status, 
    share_status: this.share_status, 
    time: this.time, 
    start_at: this.start_at, 
    url: this.url, 
    type: this.type
  }
}
Quote.prototype.fromJson = function(obj){
  if(obj.hasOwnProperty('_id')){
    this.id = obj._id.toString(); 
  }
  else if(obj.hasOwnProperty('id')){
    this.id = obj.id; 
  }
  if(obj.hasOwnProperty('refrence_khatm')){
    this.refrence_khatm = obj.refrence_khatm;
  }
  if(obj.hasOwnProperty('owner_id')){
    this.owner_id = obj.owner_id; 
  }
  if(obj.hasOwnProperty('status')){
    this.status = obj.status; 
  }
  if(obj.hasOwnProperty('share_status')){
    this.share_status = obj.share_status;
  }
  if(obj.hasOwnProperty('time')){
    this.time = obj.time; 
  }
  if(obj.hasOwnProperty('start_at')){
    this.start_at = obj.start_at; 
  }
  if(obj.hasOwnProperty('url')){
    this.url = obj.url 
  }
  if(obj.hasOwnProperty('type')){
    this.type = obj.type
  }
}
Quote.prototype.dbOut =  function(){
  return {
    refrence_khatm: this.refrence_khatm, 
    owner_id: this.owner_id, 
    status: this.status, 
    share_status: this.share_status, 
    time: this.time, 
    start_at: this.start_at, 
    created_at: this.created_at, 
    url: this.url, 
    type: this.type
  }
}
Quote.prototype.store = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  this.created_at = (new Date()).getTime();
  global.log.debug("quote save is: ", this.dbOut())
  var result = await db.InsertManyDB([this.dbOut()], 'quote');
  this.id = result[0]._id.toString();
}; 
Quote.prototype.restore = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find')
  }
  var filter = {}
  if(this.id.length > 0 ){
    filter = {"_id": db.ObjectId(this.id)}
  }
  let temp = await db.GetSpecificFromDB(filter, 'quote', {});
  if(temp.length){
    this.fromJson(temp[0].docs);
    global.log.debug(temp[0].docs)
  }else{
    throw new Error("There isnt any campaign with this id");
  } 
};
Quote.prototype.update= async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find')
  }
  var filter = {}
  if(this.id.length > 0 ){
    filter = {"_id": db.ObjectId(this.id)}
  }
  global.log.debug("update: ", this.dbOut())
  let temp = await db.UpdateDB(filter, this.dbOut(),'quote', {});
  global.log.debug(temp)
}
module.exports = Quote 
