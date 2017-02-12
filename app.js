var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flockos = require('flockos');

var index = require('./routes/index');
var flock = require('./routes/flock');
var flowroute = require("./routes/flowroute");
var userData = require("./user-data");

flockos.appId = 'e03750eb-5a0d-45ed-a843-c296605314a1';
flockos.appSecret = '73157c5e-2eb4-4827-b379-0df2361df5ec';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flockos.events.tokenVerifier);


app.use(function(req, res, next) {
  req.flock = flockos;
  req.userData = userData;
  next();
});

app.use('/', index);
app.use('/flock', flock);
app.use('/flowroute', flowroute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
