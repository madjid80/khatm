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
    refrence: this.refrence_khatm, 
    owner_id: this.owner_id, 
    status: this.status, 
    share_status: this.share_status, 
    time: this.time, 
    start_at: this.start_at, 
    url: this.url, 
    type: this.type
  }
}
Quote.prototype.fromJson = function(){}
Quote.prototype.dbOut =  function(){
  return {
    id: this.id, 
    refrence: this.refrence_khatm, 
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
Quote.prototype.restore = function(){};

var Khatm = function(){
  this.id = null; 
  this.ownerId = null ; 
  this.progress = null ;
  this.quote = [];
  this.title = null ; 
  this.url = null;
  this.type = null ;
  this.created_at = null; 
}

Khatm.prototype.fromJson = function(obj){
  if(obj.hasOwnProperty("_id")){
    this.id = obj._id.toString();  
  }else if(obj.hasOwnProperty("id")){
    this.id = obj.id;
  }

  if(obj.hasOwnProperty("ownerId")){
    this.ownerId = obj.ownerId; 
  }else{
    throw new Error("There is n't any ownerID for this khatm")
  }
  if(obj.hasOwnProperty("progress")){
    this.progress = obj.progress; 
  }
  if(obj.hasOwnProperty("quote")){
    this.quote = obj.quote; 
  }
  if(obj.hasOwnProperty("title")){
    this.title = obj.title; 
  }else{
    throw new Error("There is n't any title for this khatm")
  }
  if(obj.hasOwnProperty("url")){
    this.url = obj.url 
  }
  if(obj.hasOwnProperty("type")){
    this.type = obj.type
  }else{
    throw new Error("There is n't any type for this khatm")
  }

  if(obj.hasOwnProperty("created_at")){
    this.created_at = obj.created_at
  }
}
Khatm.prototype.toJson = function(){
  return {
    id: this.id, 
    ownerId: this.ownerId, 
    progress: this.progress, 
    quote: this.quote, 
    title: this.title, 
    url: this.url, 
    type: this.type
  }
}
Khatm.prototype.dbOut = function(){
  return {
    id: this.id, 
    ownerId: this.ownerId, 
    title: this.title, 
    type: this.type,
    created_at: this.created_at
  }
}
Khatm.prototype.store = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find');
  }
  this.created_at = (new Date()).getTime();

  var result = await db.InsertManyDB([this.dbOut()], 'khatm');
  this.id = result[0]._id.toString();

}
Khatm.prototype.restore = async function(){}
Khatm.prototype.buildBasedOnPage = async function(){
  var khatm = this;
  var refrence = db.CreateRefrence('khatm', khatm.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 604,10,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;
        quote.type = 0 ;   
        quote.refrence_khatm = refrence; 
        quote.store(); 
    }, function(err, results){
      global.log.error(err)
      resolve();
    });
  });
   
}
Khatm.prototype.buildBasedOnHezb = async function(){
  var khatm = this;
  var refrence = db.createRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 120,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 1 ;   
        quote.refrence_khatm = refrence; 
        await quote.store(); 
    }, function(err, results){
      resolve();
    }); 
  });
}
Khatm.prototype.buildBasedOnJoz = async function(){
  var khatm = this;
  var refrence = db.createRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 30,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 2 ;   
        quote.refrence_khatm = refrence; 
        await quote.store(); 
    }, function(err, results){
      resolve();
    }); 
  });
}
Khatm.prototype.buildBasedOnManzil = async function(){
  var khatm = this;
  var refrence = db.createRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 7,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 3 ;   
        quote.refrence_khatm = refrence; 
        await quote.store(); 
    }, function(err, results){
      resolve();
    }); 
  });
}
Khatm.prototype.build = async function(){
  try{
  if(this.type == 0 ){
    this.buildBasedOnPage();  
  }else if(this.type == 1 ){
    this.buildBasedOnHezb();
  }else if(this.type == 2 ){ 
    this.buildBasedOnJoz(); 
  }else if(this.type == 3 ){
    this.buildBasedOnManzil(); 
  }
  }catch(e){
    global.log.error("khatm build has error", e)
  }
}
module.exports = Khatm 
