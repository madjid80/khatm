var express = require('express')
var app = express.Router()
var user = require(__dirname+'/security/endpoints.js')
var khatm = require(__dirname+'/khatm/endpoints.js')



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

/**
* Khatm API
**/
app.post('/khatm/create', khatm.create); 
app.get('/khatm/features', khatm.getAllFeatures); 
app.get('/khatm/', khatm.getAllUserKhatm); 
app.get('/khatm/:id', khatm.getSpecificKhatm); 
app.put('/khatm/:id', khatm.modifyKhatm); 
 
/**
*
*/
app.post('/khatm/:id/quote/:num', khatm.reserveQuotes);

exports.router = app;
exports.userTokenCheck = user.tokenCheck
