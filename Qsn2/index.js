var express=require("express");
var bodyParser=require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
var User = require('./model.js');

mongoose.connect('mongodb://localhost:27017/passport');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
        //console.log(username, password)
        User.find({ }, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                console.log( docs);
            }
        });
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            console.log("username not found")
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
            console.log("password wrong")
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  app.get('/loggedin', function(req, res, next) {
      res.sendFile('signin.html', { root: __dirname });
  })


  app.post('/login', 
    passport.authenticate('local'), 
    // { successRedirect: '/loggedin', 
    //                                  failureRedirect: '/',
    //                                  failureFlash: true},
    function(req, res) {
        res.redirect('/loggedin');
      }
)

app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
        });
        res.sendFile('./form.html', { root: __dirname });
    //return res.redirect('form.html');
    }).listen(3000)
    
    
    console.log("server listening at port 3000");
    