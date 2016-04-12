/*
 * Note to you as a developer: there are a few missing pieces to this file.
 *
 * Account information from Stormpath has been deleted. You can obtain a free
 * developer account, with no credit card required and with a quota of 100,000
 * API calls per month (typical usage will see around 3 calls per login), and
 * the option of paid plans if your traffic exceeds 100,000 calls per month.
 *
 * The secret key has also been deleted. For that, we recommend generating
 * a secret key from a Linux / Unix / Mac / Cygwin system with /dev/random.
 * (Cygwin, available from http://cygwin.org, provides decent, if not entirely
 * reliable, Unix-like functionality under Windows.) From the Linux / Unix /
 * Mac / Cygwin prompt, type:
 *
 * python -c 'import binascii; print binascii.hexlify(open("/dev/random").read(1024))'
 *
 * That will get you 1k of cryptographically strong random bytes, with an
 * encoding easy to copy and paste.
 */
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var stormpath = require('express-stormpath');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Authentication middleware.
app.use(stormpath.init(app, {
  apiKeyId: '[Deleted]',
  apiKeySecret: '[Deleted]',
  application:
    '[Deleted]',
  secretKey: 
    '[Deleted]',
  sessionDuration: 365 * 24 * 60 * 60 * 1000
  }));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(8000, function() {
  console.log('Server running.');
});

module.exports = app;
