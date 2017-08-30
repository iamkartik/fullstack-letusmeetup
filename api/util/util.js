var moment=require('moment');
var environment = process.env.NODE_ENV || 'development';
var config=require('__dirname/../../config/config.js')[environment];

const keyspace = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

exports.createEventId=function(){
    let id ='';
    for(let i=0;i<10;i++){
        id+= keyspace[Math.floor(Math.random()*keyspace.length)];
    }
    return id;
}

exports.invalidData=function(data){
    if(null==data||""==data){
         return true;
    }else{
        return false;
    }
}


exports.calenderLink=function(data){
 var date=moment(data.date).format("YYYYMMDDTHHmmss");
 var time1 = moment.utc(data.time).format("YYYYMMDDTHHmmss");
 var time2 = moment.utc(data.time).add(1,'hours').format("YYYYMMDDTHHmmss");
 var startTime=date.split("T")[0]+"T"+time1.split("T")[1]+"Z";
 var endTime=date.split("T")[0]+"T"+time2.split("T")[1]+"Z";
 var linkend=encodeURIComponent(data.eventName)+'&dates='+startTime+'/'+endTime+'&location='+encodeURIComponent(data.location);
 return config.googleCalenderLink+linkend;

}

