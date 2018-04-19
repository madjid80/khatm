var config = require('config');
var cors = require('cors');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var api = require('./api.js');

var redis = require('redis');
var redisClient = new redis.createClient({
  host: config.get('DB.redis.host'),
  port: config.get('DB.redis.port'),
  password: process.env.REDIS_PASS
});
var Log = require('log');
var logStream =
  fs.createWriteStream(config.get('log.file.path'));
const log = new Log(config.get('log.level'),
  {
    write: function (msg) {
      if (config.has('log') &&
        config.get('log.enable')) {
        if (config.has('log.file') &&
          config.get('log.file.enable')) {
          logStream.write(msg);
        }
      }
    }
  });
/**
 * CORS Enablity
 */
if (config.has('cors.enable') &&
  config.get('cors.enable')) {
  app.use(cors());
}
/**
 * Middle Wares
 */
/**
 *
 * @param req
 * @param res
 * @param next
 */
function requestLogging(req, res, next) {
  log.info("A request entered");
  req.received_at = (new Date()).getTime();
  app.use('/', api.router);
  next();
}



async function authentication(req, res, next) {
  log.info("Authentication middle ware called");
  var token = req.get('token');
  log.debug("incoming token is: " + token);
  if (!token) {
    //log in as anymous user
    next()
    return 
  }
  try {
   /**
    var result = await CheckAuthentication(token, version);
    if (result.isAuth != true) {
      log.error(result);
      throw new Error("Access denied");
    }
    res.set('token', result.newToken);
    req.user = {role: result.user_role, role_code: result.user_role.code, username: result.user_name}; **/
  } catch (e) {
    log.error('The token is unvlid and not authorized');
    log.error(e);
    res.status(401).send('Access Denied');
    return;
  }
  next();
}

app.use(requestLogging);
app.use(authentication);
app.use(bodyParser.json()); // for parsing application/json

mongo.MongoClient.connect(
    'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+
    config.get('DB.mongodb.host')+':'+config.get('DB.mongodb.port'), function(err, client){
  log.info("Mongo Client is going to connect");
  if (err) {
    global.mongodb = null;
    log.error("mongo data base cant connect to database");
    log.error(err);
    return;
  }
  log.info('mongo data base connected successfully');
  global.mongodb = client.db('khatm');
});


app.listen(config.get('port'), function(){
  global.log = log;
  log.info('Campaign server started');
  //global.redisClient = redisClient;
});
