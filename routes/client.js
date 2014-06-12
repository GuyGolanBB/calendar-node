var Client = require('../models/client');

module.exports = function(app,passport) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/clients',isLoggedIn, function(req, res) {			
		if (!req.query.cIndex) {
			Client.find(callback);
			return;
		}
		
		Client.find({cIndex: new RegExp(req.query.cIndex,'i')},callback);
		
		function callback(err,clients){
			if (err)
				res.send(err)
			
			res.json(clients);
		}
	});

	app.post('/api/clients', isLoggedIn,

		function(req, res) {			
		Client.create({
		name : req.body.name,
		cIndex : req.body.cIndex,
		city : req.body.city,
		street : req.body.street,	
		phone : req.body.phone,
		// contacts : [{ name : String, number : String}],
		notes : req.body.notes,
		mokedKavi : req.body.mokedKavi,
		mokedAlchuti : req.body.mokedAlchuti
	}, function(err, client) {
			if (err)
				res.send(err);

				res.json(client);			
		});

	});

	app.delete('/api/clients/:client_id', isLoggedIn,
		function(req, res) {		
		Client.remove({
			_id : req.params.client_id
		}, function(err, client) {
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
