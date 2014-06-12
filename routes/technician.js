var Technician = require('../models/technician');
var Appointment = require('../models/appointment');
var async = require('async');

module.exports = function(app,passport) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/technicians', isLoggedIn,function(req, res) {

		// use mongoose to get all todos in the database
		Technician.find().populate('appointments').exec(function(err, technicians) {
			if (err)	
				res.send(err)



    		var iter = function (technician, callback) {
                Appointment.populate(technician.appointments, {
                    path: 'client status jobType'
                }, callback);
            };

            async.each(technicians, iter, function done(err	) {
            	if (!err) {
            		res.json(technicians);	
            	}
                
            });			
		});
	});

	app.post('/api/technicians', isLoggedIn,
		function(req, res) {			
		Technician.create({
			name : req.body.name,
			phone : req.body.phone,
			isActive : true
		}, function(err, technician) {
			if (err)
				res.send(err);

				res.json(technician);			
		});

	});

	app.delete('/api/technicians/:technician_id',isLoggedIn,
		 function(req, res) {		
		Technician.remove({
			_id : req.params.technician_id
		}, function(err, technician) {
			if (err)
				res.send(err);

			res.json(true);
		});
	});

	app.put('/api/technicians/:technician_id',isLoggedIn,
		 function(req, res) {		
		var updatedData = {
			name : req.body.name,
			phone : req.body.phone,
			isActive : req.body.isActive,
			appointments : req.body.appointments
		}
		Technician.update({_id : req.params.technician_id},updatedData,
			 function(err, technician) {
			if (err)
				res.send(err);

			res.json(true);
		});
	});	
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send(401);
}

