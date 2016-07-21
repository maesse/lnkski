var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require("hbs");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var googleConfig = require("./googleauth.json");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'whatisthisidonteven',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// TODO: Use LESS instead and import that way
app.use('/bootstrap-social',express.static(path.join(__dirname, '/node_modules/bootstrap-social')));
app.use('/font-awesome',express.static(path.join(__dirname, '/node_modules/font-awesome')));

app.use('/', routes);
app.use('/users', users);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log("The local strat!");
      Account.findOrCreate({ 'local.username' : username }, { 'local.password' : password }, function(err, user, created) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        return done(null, user);
      });
    }
));
passport.use(new FacebookStrategy({
      clientID: "1734174693508836",
      clientSecret: "fa8f62ff86be168296b32dce85572e59",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("Da Face strat!");
      Account.findOrCreate({ 'facebook.id' : profile.id }, { 'facebook.token' : accessToken }, function(err, user, created) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect.' });
        }
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        return done(null, user);
      });
    }
));

passport.use(new GoogleStrategy({
        clientID: googleConfig.web.client_id,
        clientSecret: googleConfig.web.client_secret,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
        console.log("Da Google strat!");
        Account.findOrCreate({ 'google.id': profile.id }, { 'google.token': token }, function (err, user, created) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect.' });
            }
            // if (!user.validPassword(password)) {
            //   return done(null, false, { message: 'Incorrect password.' });
            // }
            return done(null, user);
        });
    }
));

passport.use(new TwitterStrategy({
        consumerKey: 'Lx4Ww3N1nsa33DRjc6ejtRWlI',
        consumerSecret: 'PmXJ7aPlxOgVy0f6PJG1edT1ob2QMpBaTQsbRaStSp3u3ZtFbC',
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        console.log("Da twitter strat!");
        Account.findOrCreate({ 'twitter.id': profile.id }, { 'twitter.token': token }, function (err, user, created) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect.' });
            }
            // if (!user.validPassword(password)) {
            //   return done(null, false, { message: 'Incorrect password.' });
            // }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');


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


module.exports = app;
