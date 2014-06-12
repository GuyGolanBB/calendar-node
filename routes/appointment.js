var Appointment = require('../models/appointment');
	Technician = require('../models/technician'),
	mongoose = require('mongoose'),


module.exports = function(app,passport) {
	

	app.get('/api/appointments/:appointment_id',isLoggedIn,
	    function(req, res) {

		Appointment.findOne({_id: req.params.appointment_id})
			.populate('status client jobType')
				.exec(function(err,appointment) {
					if (err)
						res.send(err)

					res.json(appointment); 
				});				
	});	


	app.get('/api/appointments',isLoggedIn,
	 function(req, res) {

		Appointment.find(function(err, appointments) {

			if (err)
				res.send(err)

			res.json(appointments); 
		});
	});

	app.post('/api/appointments',isLoggedIn,
		function(req, res) {			

		Appointment.create({
			startTime : req.body.startTime,
			endTime : req.body.endTime,
			problem: req.body.problem,
			status: req.body.status,
			client: req.body.client,
			jobType : req.body.jobType,
			sms : req.body.sms,
			approve: req.body.approve,	
			notes: req.body.notes,			
			// createdBy : '1' || req.body.userId,
			// lastUpdatedBy: '1' || req.body.userId		
		}, function(err, appointment) {
			if (err)
				res.send(err);
			

			if (!req.body.technicians.length) {
				res.send('no technician selected');
			}
			
			Technician.find({ _id : { $in : req.body.technicians} },
				function(err,technicians) {
				for (var i = technicians.length - 1; i >= 0; i--) {
					technicians[i].appointments.push(appointment._id);
					technicians[i].save();
				};
			});			

			Appointment.findOne({_id: appointment._id})
				.populate('status client jobType')
					.exec(function(err,popAppointment) {
						if (err)
							res.send(err)

						res.json(popAppointment);

					});				
			});

	});

	app.delete('/api/appointments/:appointment_id',isLoggedIn,function(req, res) {		
		Appointment.remove({
			_id : req.params.appointment_id
		}, function(err, appointment) {
			if (err)
				res.send(err);

			res.json(true);
		});
	});

	app.put('/api/appointments/:appointment_id', isLoggedIn,
		function(req, res) {
		var updatedData = {			
			startTime : req.body.startTime,
			endTime : req.body.endTime,
			problem: req.body.problem,
			status: req.body.status,
			client: req.body.client,
			sms : req.body.sms,
			approve: req.body.approve,
			jobType : req.body.jobType,
			notes: req.body.notes || '',
			updatedDate : new Date()
			//lastUpdatedBy:{type : mongoose.Schema.Types.ObjectId, ref: 'User'}				
		}
		Appointment.update({_id : req.params.appointment_id},updatedData,
			 function(err, appointment) {
			if (err)
				res.send(err);
	 			 		
			Technician.update( 
				{ },	
      			{ $pull: { appointments : mongoose.Types.ObjectId(req.params.appointment_id) } },
      			{ multi: true },
     			function (err, obj) {         
					Technician.find({ _id : { $in : req.body.technicians} },
						function(err,technicians) {
							for (var i = technicians.length - 1; i >= 0; i--) {
								technicians[i].appointments.push(req.params.appointment_id);
								technicians[i].save();
							}
						});			     				

					Appointment.findOne({_id: req.params.appointment_id})
						.populate('status client jobType')
						.exec(function(err,appointmentPop) {
							if (err)
							res.send(err)	

						res.json(appointmentPop); 
					});							
      			}
      		);
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
