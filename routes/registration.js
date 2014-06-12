module.exports = function(app,passport) {

	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			console.log(err,user,info);
	    	if (err) { 
	    		return res.json(err); 
	    	}
	    	if (!user) {
	    	 return res.json(info); 
	    	}
	    	req.login(user, function(err) {
	      		if (err) {
	      		 return res.json(err); 
	      		}

	      		return res.json(user);
	    	});

	  	})(req, res, next);
	});



	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
	    	if (err) { 
	    		return res.json(err); 
	    	}
	    	if (!user) {
	    	 return res.json(info); 
	    	}
	    	req.login(user, function(err) {
	      		if (err) {
	      		 return res.json(err); 
	      		}
	      		return res.json(user);
	    	});

	  	})(req, res, next);
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.send(200);
	});	

	app.get('/user/isAuthenticated', function(req,res){
		if (req.isAuthenticated) {
			res.json(req.user);
			return;
		}

		res.json(false);
	});
};