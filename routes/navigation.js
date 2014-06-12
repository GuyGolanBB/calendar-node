module.exports = function(app,passport) {
	app.get('/calendar', isLoggedIn, function(req, res) {
		res.sendFile('./public/index.html');
	});
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send(401);
}
