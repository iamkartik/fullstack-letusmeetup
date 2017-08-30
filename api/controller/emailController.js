/**
 * Created by kartik on 25/6/16.
 */
var nodeMailer=require('nodemailer');
var environment = process.env.NODE_ENV || 'development';
var config=require('__dirname/../../config/config.js')[environment];
var queries=require('../model/eventQueries.js');
var fs=require('fs');
var util=require('../util/util.js');
var moment=require('moment');
var handlebars = require('handlebars');


/**
 * Link creation email
 */

exports.newEventEmail=function(eventId){
    // create the new template here and call sendMail
    //console.log("eventID is ::"+eventId);
queries.getAllEventDetails(eventId).then(function (data){
// data contains all the event data
    fs.readFile(__dirname+'/../../views/newEventEmailTemplate.html','utf-8',function(err,template){
        if(err){console.log(err);}
        else{
            var link=config.url+eventId;
            var calenderLink=util.calenderLink(data);
            var templateData={
                eventLink: link,
                eventName: data.eventName,
                calenderLink: calenderLink
            };
            let compiledTemplate = handlebars.compile(template);
            const emailData = compiledTemplate(templateData);
            var subject='Thanks for using Letusmeetup , your event '+data.eventName+' is up and running';
            sendEmail(subject,data.organizerMail,emailData);
        }
     });
}).catch(function(err){
    console.log(err);
});
};

/**
 * Name addition email , with add to calender link
 */

exports.addToListEmail=function(eventId,emailId){
    // create the add to list template here and call sendMail
    queries.getAllEventDetails(eventId).then(function (data){
// data contains all the event data
        fs.readFile(__dirname+'/../../views/addToEventEmailTemplate.html','utf-8',function(err,template){
            if(err){console.log(err);}
            else{
                var date = moment.parseZone(data.date).format('MMMM Do YYYY');
                var time = moment.parseZone(data.time).format('h:mm:ss a');
                var link=config.url+eventId;
                var calenderLink=util.calenderLink(data);
                var templateData={
                    organizer:data.organizer,
                    date: date,
                    time: time,
                    eventLink: link,
                    eventName: data.eventName,
                    calenderLink: calenderLink
                };
                let compiledTemplate = handlebars.compile(template);
                const emailData = compiledTemplate(templateData);
                var subject='Thanks for using Letusmeetup ,'+data.organizer+' will be waiting for you .';
                //console.log(emailData);
                sendEmail(subject,emailId,emailData);
            }
        });
    }).catch(function(err){
        console.log(err);
    });

};

sendEmail=function(subject,emailId,data){

    var mailer=nodeMailer.createTransport({
        host:config.emailHost,
        port:config.emailPort,
        secure:true,
        auth:{
        user:config.emailUser,
        pass:config.emailPass
    }});

    /*var sendmail = mailer.templateSender({
        subject: subject,
        html:template
    }, {
        from: 'hello@letusmeetup.com',
    });

    sendmail({
        to: emailId
    }, data, function (err, info) {
        if (err) {
            console.log('Error');
        } else {
            console.log(info);
        }
    });*/

    let options = {
        from:'hello@letusmeetup.com',
        to:emailId,
        subject:subject,
        html:data
    }
    mailer.sendMail(options,(err,res)=>{
        if(err) throw err;

       // console.log(res)
    });

    };
