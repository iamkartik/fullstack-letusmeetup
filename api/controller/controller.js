var query = require('../model/eventQueries.js');
var util = require('../util/util.js');
var environment = process.env.NODE_ENV || 'development';
var moment=require('moment');
var config = require('__dirname/../../config/config.js')[environment];
var mailController=require('./emailController.js');

exports.index = function (req, res, next) {
    var data = {"url":config.host};
    res.render('../views/create.html',data);
};

/**
 * @param req
 * @param res
 * @param next
 */

exports.getEvent = function (req, res, next) {
    // get the meeting Id
    var meetingId = req.params.id;
    query.getEvent(meetingId).then(function (data) {
       

        var date = moment.parseZone(data.date).format('MMMM Do YYYY');
        var time = moment.parseZone(data.time).format('h:mm a');
        var rdata = {
            "eventId": data.eventId,
            "eventName": data.eventName,
            "organizer": data.organizer,
            "location": data.location,
            "date": date,
            "time": time,
            "attendees": data.attendees,
            "url":config.host
        };
        res.render('../views/event.html', rdata);
    }).catch(function (err) {
        res.status(500).render("../views/error.html");
    });


};

exports.createNewEvent = function createNewEvent(req, res, next) {
    var link=null;
    var eventName = req.body.eventName;
    var organizer = req.body.organizer;
    var location = req.body.location;
    var date = Date.parse(req.body.date);
    var time = Date.parse(req.body.time);
    var email=req.body.email;
    var idate=req.body.date;
    var itime=req.body.time;
    
    if (isNaN(date) || isNaN(time) || util.invalidData(eventName) || util.invalidData(location) || util.invalidData(organizer)) {
        // render custom error page
        // send error code
        res.status(500).send("invalid input");
    } else {
        var data = {
            "eventId": "",
            "eventName": eventName,
            "organizer": organizer,
            "organizerMail":email,
            "location": location,
            "date": idate,
            "time": itime,
            "attendees": [],
            "emails": []
        };
//      console.log(data);
        var eId;
        query.createEvent(data).then(function (result) {
            return new Promise(function (resolve, reject) {
                if (null != result) {
                    eId = util.createEventId();
                    result.eventId = eId;
                    resolve(result);
                } else {
                    reject("some issue");
                }
            });
        }).then(function (updation) {
            return query.updateEventId(updation);
        }).then(function (r) {
            link = config.url + eId;
            if(!util.invalidData(data.organizerMail)){
                
                mailController.newEventEmail(eId);
            }
            res.send(link);
        }).catch(function (err) {
            console.log(err);
        });

    }

};

exports.confirmPresence = function (req, res, next) {
    var data = {
        "eventId": req.body.eventId,
        "email": req.body.email,
        "name": req.body.name
    };

    if (util.invalidData(data.name) || util.invalidData(data.eventId)) {
        res.status(500).send("invalid input");
    } else {
        query.confirmPresence(data).then(function (result) {
            if(!util.invalidData(data.email)){
                mailController.addToListEmail(data.eventId,data.email);
            }
            res.send("success");
        }).catch(function (err) {
            console.log(err);
        });
    }
};
