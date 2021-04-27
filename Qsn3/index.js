var express=require("express");
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
  var app=express()
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new FacebookStrategy({
    clientID: 130036042395429,
    clientSecret: "ab9be30d0f8e8ca89e2129a12911d11f",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
    // User.findOrCreate(... function(err, user) {
    //   if (err) { return done(err); }
       done(null, profile);
    // });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));

app.get('/',function(req,res){
res.set({
    'Access-control-Allow-Origin': '*'
    });
    res.sendFile('login.html', { root: __dirname });
//return res.redirect('form.html');
}).listen(3000)


console.log("server listening at port 3000");
