
exports.hdel = function(hash, key){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.hdel(hash, key, function(err, result){
      global.log.info("Answer of hdel Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hdel function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hdel in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.del = function(key){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.del(key, function(err, result){
      global.log.info("Answer of del Function in redis file just recieved.")
      if(err){
        global.log.error("Redis del function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of del in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.hgetall = function(key){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.hgetall(key, function(err, result){
      global.log.info("Answer of hgetall Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hgetall function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hgetall in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.hget = function(hashname, key){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.hget([hashname ,key], function(err, result){
      global.log.info("Answer of hget Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hget function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hget in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.hset = function(hashname, key, value){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return
    }
    global.redisClient.hset(hashname ,key, value, function(err, result){
      global.log.info("Answer of hset Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hset function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hset in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.incrby = function(name , value){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.incrby(name, value, function(err, result){
      global.log.info("Answer of incrby Function in redis file just recieved.")
      if(err){
        global.log.error("Redis incrby function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of incrby in redis file is:", result)
        resolve(result)
      }
    })
  })
}
exports.hincrby = function(hash, field, value){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.hincrby(hash, field, value, function(err, result){
      global.log.info("Answer of hincrby Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hincrby function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hincrby in redis file is:", result)
        resolve(result)
      }
    })
  })
}

exports.hkeys = function(label){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.hkeys(label, function(err, result){
      global.log.info("Answer of hkeys Function in redis file just recieved.")
      if(err){
        global.log.error("Redis hkeys function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of hkeys in redis file is:", result)
        resolve(result)
      }
    })
  })
}

exports.get = function(key){
  return new Promise((resolve, reject)=>{
    if(!global.redisClient){
      reject(new Error("redis client is not connected"))
      return 
    }
    global.redisClient.get(key,function(err, result){
      global.log.info("Answer of Get Function in redis file just recieved.")
      if(err){
        global.log.error("Redis Get function has an error: ",err)
        reject(err)
      }else{
        global.log.debug("The result of get in redis file is:", result)
        resolve(result)
      }
    })
  })
}
