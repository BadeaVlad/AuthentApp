/*  EXPRESS */

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('reg', (req, res) => res.sendFile('reg.html', { root : __dirname}));

const port = 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

/* MONGOOSE 

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase');

const Schema = mongoose.Schema;
const UserDetail = new Schema({
      username: String,
      password: String
    });
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');*/

/* PASSPORT LOCAL */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      UserDetails.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });

/* MONGODB */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {

    if (err) throw err;
    var dbo = db.db("authdb");
    /*dbo.createCollection("users", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
    });*/
    var myobj = { name: "Vlad", password: "admin" };
    dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
});