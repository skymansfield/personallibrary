'use strict';
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt')
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
let LoginModel = require('./models/userschema');

const app = express();

app.set('view engine', 'pug');

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, data) => {
  if (err) {
    console.log('Database error ' + err);
  } else {
    console.log('Success!!');

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
      LoginModel.findOne(
        { _id: new ObjectID(id) },
        (err, doc) => {
          done(null, doc);
        }
      );
    });

    passport.use(new LocalStrategy(
      function (username, password, done) {
        LoginModel.findOne({ username: username }, (err, user) => {
          console.log('User ' + username + ' attempted to log in.');
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        });
      }
    ));
  }
  app.use('/', userRoutes);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        let error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 1500);
  }
});

module.exports = app;
