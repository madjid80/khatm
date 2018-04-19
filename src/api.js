var express = require('express')
var app = express.Router()
var user = require(__dirname+'/security/endpoints.js')



function pong(req, res){
  res.send("pong")
}
app.get('/ping', pong);

/**
* USER api
**/
app.post('/user/create', user.create)
app.post('/user/login', user.login)
app.get('/user/:id', user.getUser)
app.put('/user/:id', user.modifyUser)
app.post('/user/verify', user.tokenVerification)

exports.router = app;
exports.userTokenCheck = user.tokenCheck
