var mongo = require('mongodb');
module.exports.InsertManyDB = function(objs, collection){
  return new Promise((resolve, reject)=>{
    global.log.info("InsertManyDB called");
    if(global.mongodb == null ){
      global.log.error("global.mongodb in read.js and get specific campaign function is null")
      reject("global.mongodb in read.js and get specific campaign function is null")
    }
    global.mongodb.collection(collection).insertMany(objs,function(err, result){
      if(err){
        global.log.error("DB insert que  ry has an error")
        reject(err)
        return
      }

      resolve(result.ops)
    })
  });
}

module.exports.UpdateDB = function(condition, obj, collection) {
  return new Promise((resolve, reject)=>{
    global.log.info("UpdateDB called");
    if(global.mongodb == null ){
      global.log.error("global.mongodb in read.js and get specific campaign function is null")
      reject("global.mongodb in read.js and get specific campaign function is null")
    }
    global.mongodb.collection(collection).update(condition, obj, function (err, result) {
      if(err){
        global.log.error("DB insert que  ry has an error")
        reject(err)
        return
      }
      resolve(result.ops)
    }
  )
});
}

module.exports.FindAllFromDB = function(filters, collection ){
  return new Promise((resolve, reject) => {
    global.log.info("FindAllFromDB called");
    if(global.mongodb == null ){
    global.log.error("global.mongodb in read.js and get specific campaign function is null")
    reject("global.mongodb in read.js and get specific campaign function is null")
  }
  global.mongodb.collection(collection).find(filters).toArray(function(err, docs){
    if(err){
      global.log.error("query on mongo db has error")
      global.log.error(err)
      reject(err)
    }else{
      resolve(docs)
    }
  })
});
};

module.exports.GetAllFromDB = function(filters, skip , limit, collection, secondryFilter ){
  return new Promise((resolve, reject) => {
    global.log.info("GetAllFromDB called");
    if(global.mongodb == null ){
      global.log.error("global.mongodb in read.js and get specific campaign function is null")
      reject("global.mongodb in read.js and get specific campaign function is null")
    }
    var aggrigateFilter = [
      {"$match":filters},
      {"$sort": {"created_at": -1}},
      {"$group":{"_id":"$refrence", "docs":{"$first":"$$ROOT"}}},
      {"$match":secondryFilter},
      {"$sort": {"docs.created_at": -1}}
    ];
    if(limit > 0 ){
      aggrigateFilter.push({"$limit":skip+limit});
      aggrigateFilter.push({"$skip":skip});
    }
    global.mongodb.collection(collection).aggregate(aggrigateFilter).toArray(function(err, docs){
      if(err){
        global.log.error("query on mongo db has error")
        global.log.error(err)
        reject(err)
      }else{
        resolve(docs)
      }
    })
  });
};
module.exports.GetSpecificFromDB = function (filters, collection, secondryFilter){
  return new Promise((resolve, reject) => {
    global.log.info("GetSpecificFromDB called");
    if(global.mongodb == null ){
      global.log.error("global.mongodb in read.js and get specific campaign function is null")
      reject("global.mongodb in read.js and get specific campaign function is null")
    }
    global.mongodb.collection(collection).aggregate([
    {"$match":filters},
    {"$sort":{'created_at':-1}},
    {"$group":{"_id":"$refrence", "docs":{"$first":"$$ROOT"}}},
    {"$match":secondryFilter},

    ]).toArray(function(err, docs){
      if(err){
        global.log.error("query on mongo db has error")
        global.log.error(err)
        reject(err)
      }else{
        resolve(docs)
      }
    })

  });
};
module.exports.AggrigateDB = function(aggrigateFilter, collection ){
  return new Promise((resolve, reject) => {
    global.log.info("AggrigateDB in mongoDB utility called")
  if(global.mongodb == null ){
    global.log.error("global.mongodb in read.js and get specific campaign function is null")
    reject("global.mongodb in read.js and get specific campaign function is null")
  }
  global.mongodb.collection(collection).aggregate(aggrigateFilter).toArray(function(err, docs){
    if(err){
      global.log.error("query on mongo db has error")
      global.log.error(err)
      reject(err)
    }else{
      resolve(docs)
    }
  })
});
}
module.exports.CreateRefrence = function(collection , id){
  global.log.info("CreateRefrence called");
  return new mongo.DBRef(collection, new mongo.ObjectId(id))
}

module.exports.ObjectId = function( id){
  global.log.info("ObjectID called");
  return new mongo.ObjectId(id)
}
