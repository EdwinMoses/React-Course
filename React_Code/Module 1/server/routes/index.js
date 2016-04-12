var body_parser = require('body-parser');
var json_parser = body_parser.json();
var express = require('express');
var stormpath = require('express-stormpath');

if (typeof localStorage === 'undefined' || localStorage === null) {      
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage(__dirname + '/../localStorage',
    Infinity);
}

var sanitize = function(raw) {
  var workbench = [];
  for(var index = 0; index < raw.length; ++index) {
    if ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.'
      .indexOf(raw[index]) !== -1) {
      workbench.push(raw[index])
    }
  }
  return workbench.join('');
}

var router = express.Router();

router.get('/', stormpath.loginRequired, function(request, response) {
  response.render('index.ejs');
});

router.post('/', stormpath.loginRequired, function(request, response) {
  response.render('index.ejs');
});

var save = function(userid, identifier, value) {
  localStorage.setItem(sanitize(userid) + ':' + sanitize(identifier), value);
  return true;
}

var restore = function(userid, identifier) {
  var value = localStorage.getItem(sanitize(userid) + ':' + sanitize(identifier));
  if (value) {
    return value;
  } else {
    return 'undefined';
  }
}

router.get('/restore', json_parser, function(request, response, next) {
  var result = restore(request.user.href, request.body.identifier);
  response.type('application/json');
  response.send(result);
});

router.post('/restore', json_parser, function(request, response, next) {
  var result = restore(request.user.href, request.body.identifier);
  response.type('application/json');
  response.send(result);
});

router.post('/save', function(request, response, next) {
  var success_or_failure = save(request.user.href,
    request.body.identifier, request.body.data);
  response.type('application/json');
  response.send(String(success_or_failure));
});

module.exports = router;
