var eventModel = require('./eventModel.js');
var util = require('../util/util.js');


exports.getEvent = function (id) {
    return eventModel.findOne({eventId: id},{_id:0,__v:0,emails:0}).exec();
};

exports.getAllEventDetails = function (id) {
    return eventModel.findOne({eventId: id},{_id:0,__v:0}).exec();
};

exports.createEvent = function (data) {
    return new Promise(function (resolve, reject) {
        eventModel.create(data).catch(function(err){
            console.log(err);
        }).then(function (newEvent) {
           // console.log(newEvent);
            resolve(newEvent);
        });
    });


};

exports.updateEventId=function(data){
      return new Promise(function(resolve,reject){
        eventModel.update({_id:data._id},{$set:{eventId:data.eventId}}).
            then(function(response){
                resolve(response);
        });

    });
};

exports.confirmPresence=function(data){
    var query;
    if(util.invalidData(data.email)){
        query={$push:{attendees:data.name}};
    }else{
        //console.log("both name and email");
        query={$push:{attendees:data.name,emails:data.email}};
    }
    return new Promise(function(resolve,reject){
        eventModel.update({eventId:data.eventId},query).
            then(function(response){
                resolve(response);
            });

    });
};
