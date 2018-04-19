var asyncLib = require("async");
var db = require(__dirname+'/../utility/mongo.js')
var Quote = require(__dirname+'/quote.js')
var Khatm = function(){
  this.id = null; 
  this.ownerId = null ; 
  this.progress = null ;
  this.quote = [];
  this.title = null ; 
  this.url = null;
  this.type = null ;
  this.created_at = null; 
  this.isPublic = false; 
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

  if(obj.hasOwnProperty("isPublic")){
    this.isPublic = obj.isPublic
  }else{
    throw new Error("There is n't any isPublic for this khatm")
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
    isPublic: this.isPublic,
    type: this.type
  }
}
Khatm.prototype.dbOut = function(){
  return {
    id: this.id, 
    ownerId: this.ownerId, 
    title: this.title, 
    type: this.type,
    isPublic: this.isPublic, 
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
Khatm.prototype.update= async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find')
  }
  var filter = {}
  if(this.id.length > 0 ){
    filter = {"_id": db.ObjectId(this.id)}
  }
  let temp = await db.UpdateDB(filter, this.dbOut(),'khatm', {});
}
Khatm.prototype.restoreQuotes = async function(quotes){
  var khatm = this; 
  var quotesAll = 0; 
  var quotesDone = 0; 
  var quotesReserve = 0 ; 
  return new Promise((resolve, reject)=>{
    asyncLib.each(quotes, function(value, callback){
      var quote = new Quote(); 
      quote.fromJson(value);
      quotesAll++; 
      if(quote.owner_id){
        quotesReserve++; 
      }
      if(!quote.status && quote.status == 2){
        quotesDone++; 
      }
      khatm.quote.push(quote.toJson());
      callback();  
    },function(){
      resolve({all: quotesAll, done: quotesDone, reserve: quotesReserve});
    })
  })
}
Khatm.prototype.restore = async function(){
  if(global.mongodb == null ){
    throw new Error('Mongo db still not connected, DB cant find')
  }
  var filter = {}
  if(this.id.length > 0 ){
    filter = {"_id": db.ObjectId(this.id)}
  }
  let temp = await db.GetSpecificFromDB(filter, 'khatm', {});
  if(temp.length){
    this.fromJson(temp[0].docs);
    var refrence = db.CreateRefrence('khatm', this.id);
    var quotes = await db.FindAllFromDB({refrence_khatm:refrence}, "quote");
    this.progress = await this.restoreQuotes(quotes);
  }else{
    throw new Error("There isnt any campaign with this id");
  }
}
Khatm.prototype.buildBasedOnPage = async function(){
  var khatm = this;
  var refrence = db.CreateRefrence('khatm', khatm.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 604,10,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;
        quote.type = 0 ;   
        quote.refrence_khatm = refrence; 
        quote.url = "http://forghan.com/p/"+index
        quote.store(); 
    }, function(err, results){
      global.log.error(err)
      resolve();
    });
  });
   
}
Khatm.prototype.buildBasedOnHezb = async function(){
  var khatm = this;
  var refrence = db.CreateRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 120,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 1 ;   
        quote.refrence_khatm = refrence; 
        quote.url = "http://forghan.com/h/"+index
        quote.store(); 
    }, function(err, results){
      resolve();
    }); 
  });
}
Khatm.prototype.buildBasedOnJoz = async function(){
  var khatm = this;
  var refrence = db.CreateRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 30,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 2 ;   
        quote.refrence_khatm = refrence; 
        quote.url = "http://forghan.com/j/"+index
        quote.store(); 
    }, function(err, results){
      resolve();
    }); 
  });
}
Khatm.prototype.buildBasedOnManzil = async function(){
  var khatm = this;
  var refrence = db.CreateRefrence('khatm', this.id);
  return new Promise((reject, resolve)=>{
    asyncLib.timesLimit( 7,20,async  function(index, next){
        var quote = new Quote();
        quote.start_at = index+1;  
        quote.type = 3 ;   
        quote.refrence_khatm = refrence; 
        quote.url = "http://forghan.com/m/"+index
        quote.store(); 
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
