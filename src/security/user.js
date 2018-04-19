var User = function(){
  this.phone = ""; 
  this.email = ""; 
  this.ip = "";
  this.token = ""; 
}
User.prototype.fromJson = function (obj){}
User.prototype.toJson = function(){}
module.exports = User; 
