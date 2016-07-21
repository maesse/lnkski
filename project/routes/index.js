var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Link = require('../models/link');
var util = require("util");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/register', function(req, res, next) {
  res.render('register', { });
});

router.post('/register', function(req, res) {
  console.log("Hit register POST");
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    console.log("register callback, " + err + ", acc: " + account);
    console.log("req.body.username: " + req.body.username);
    if (err) {

      return res.render('register', { account : account });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.post('/addlink', function(req, res) {
  if(!req.body.link) res.status(200).send('No link included');
  console.log("User '" + req.user + "' adding link: " + req.body.link);

  var link = new Link.model({
    link: req.body.link,
    date: Date.now(),
      });
  req.user.links.push(link);
  req.user.save(function(err) {
    if(err) console.log(err);
    res.redirect('/');
  });


});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  console.log(req.query.test);
  res.status(200).send("pong!");
});


module.exports = router;
