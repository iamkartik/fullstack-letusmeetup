var http=require('http');
var express=require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routes = require('./config/routes.js');
var consolidate = require('consolidate');
var path =require('path');

// setting the environment 
var environment=process.env.NODE_ENV||'development';
var config=require('./config/config.js')[environment];

// db connection establishment
mongoose.connect(config.db,{useMongoClient:true});
var db=mongoose.connection;

db.on('error',function(err){
	console.log('error occured while connecting to db'+err);
	process.exit(-1);
});

db.once('open',function(){
	console.log('db connection has been made');
});


// setting the express app 
var app = express();
app.set('port',config.port||3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('views'));
app.use('/public',  express.static( 'public'));
app.set('views',path.join(__dirname+'/views'));
app.engine('html',consolidate.handlebars);
app.set('view engine','html');

// initializing routes
routes(app);

// creating http server 
http.createServer(app).listen(app.get('port'),function(){
	console.log('server has started');
});
