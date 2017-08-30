var mongoose=require('mongoose');
var schema=mongoose.Schema;


// latitude and longitude tbd 
var eventSchema= new schema({
	eventId:String,
	eventName:String,
	organizer:String,
	organizerMail:String,
	date:String,
	time:String,
	location:String,
	attendees:[String],
	emails:[String]
});

module.exports=mongoose.model('events',eventSchema);
