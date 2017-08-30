var controller=require('../api/controller/controller.js');

module.exports=function(app) {
	// body...
	app.get('/',controller.index);
	app.get('/event/:id',controller.getEvent);

	app.post('/create',controller.createNewEvent);
	app.post('/confirm',controller.confirmPresence);

};