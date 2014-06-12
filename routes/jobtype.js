var JobType = require('../models/jobtype');

module.exports = function(app,passport) {

	app.get('/api/jobtypes',isLoggedIn,
		 function(req, res) {

		JobType.find(function(err, jobtypes) {

			if (err)
				res.send(err)

			res.json(jobtypes); 
		});
	});

	app.post('/api/jobtypes', isLoggedIn,
		function(req, res) {			
		JobType.create({
			name : req.body.name,
			score : req.body.score
		}, function(err, jobType) {
			if (err)
				res.send(err);
			
				res.json(jobType);			
		});

	});

	app.delete('/api/jobtypes/:jobtype_id', isLoggedIn,
		function(req, res) {		
		JobType.remove({
			_id : req.params.jobtype_id
		}, function(err, jobType) {
			if (err)
				res.send(err);

			res.json(true);
		});
	});

	app.put('/api/jobtypes/:jobtype_id',isLoggedIn,
		 function(req, res) {		
		var updatedData = {
			name : req.body.name,
			score : req.body.score
		};

		JobType.update({_id : req.body._id},updatedData,
			 function(err, jobType) {
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
