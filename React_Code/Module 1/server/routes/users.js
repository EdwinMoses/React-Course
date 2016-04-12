var express = require('express');
var stormpath = require('express-stormpath');

var router = express.Router();

router.get('/', function(req, res, next) {
  var users = [];

  req.app.get('stormpathApplication').getAccounts(function(err, accounts) {
    if (err) return next(err);
    accounts.each(function(account, cb) {
      users.push(account);
      cb();
    }, function(err) {
      if (err) return next(err);
      res.json({ users: users });
    });
  });
});

module.exports = router;
