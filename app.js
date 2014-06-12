
/**
 * Module dependencies
 */

var express  = require('express'),
    app = module.exports = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    redisStore = require('connect-redis')(expressSession);
    flash = require('connect-flash'),

    database = require('./config/database'),
    secret = require('./config/secret'),

//errorHandler = require('error-handler'),
  http = require('http'),
  path = require('path'),
  routes = require('./routes');

mongoose.connect(database.url);
require('./config/passport')(passport); 
/**
 * Configuration
 */

// all environments
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(expressSession({
    secret : secret.secretToken,
    maxAge: new Date(Date.now() + 3600000),
    store: new redisStore({
      host: '127.0.0.1',
      port: 6379,
      prefix: 'sess'   
    })    
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

var env = process.env.NODE_ENV || 'development';

// development only
//if (env === 'development') {
//  app.use(errorHandler());
//}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name',isLoggedIn,routes.partials);

require('./routes/registration')(app,passport);

function isLoggedIn(req, res, next) {
  console.log(req.isAuthenticated());
  
  if (req.params.name === 'login' || req.params.name === 'signup') {
    return next();
  }
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.send(401);
}


// JSON API
// require('./routes/login.js')(app,passport); 
 require('./routes/technician.js')(app,passport);
 require('./routes/appointment.js')(app,passport);
 require('./routes/jobtype.js')(app,passport);
 require('./routes/status.js')(app,passport);
 require('./routes/client.js')(app,passport);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);



/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
