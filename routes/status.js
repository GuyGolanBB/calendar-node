var Status = require('../models/status');

module.exports = function(app,passport) {

	app.get('/api/statuses',isLoggedIn,
		function(req, res) {

		Status.find(function(err, statuses) {

			if (err)
				res.send(err)

			res.json(statuses);
		});
	});

	app.post('/api/statuses', isLoggedIn,
		function(req, res) {			
		Status.create({
			name : req.body.name
		}, function(err, status) {
			if (err)
				res.send(err);

				res.json(status);			
		});

	});

	app.delete('/api/statuses/:status_id',isLoggedIn,
		 function(req, res) {		
		Status.remove({
			_id : req.params.status_id
		}, function(err, status) {
			if (err)
				res.send(err);

			res.json(true);
		});
	});

	app.put('/api/statuses/:status_id',isLoggedIn,
		function(req, res) {		
		var updatedData = {
			name : req.body.name			
		}
		Status.update({_id : req.body._id},updatedData,
			 function(err, status) {
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
