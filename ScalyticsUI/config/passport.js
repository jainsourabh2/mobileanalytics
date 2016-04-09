// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var mongojs             = require('mongojs');
var config              = require('../../config/config');

// load up the user model
/*var User            = require('../app/models/user');*/

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
/*        User.findById(id, function(err, user) {*/
            done(null, user);
/*        });*/
    });

// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

      var data;
      console.log("app credentials is called");
      var dbname = 'analytics';

      db = mongojs(config.connectionstring + dbname);

        db.collection('app_details').find
          ({$and : [{"username" : {$in : [username]}}]}
           ,function (err , result) {
                if (err) 
                {
                    // if there are any errors, return the error before anything else
                      console.log(err);
                      db.close();
                      return done(err);
                  }

                 if(!result[0])
                 {
                    // if no user is found, return the message
                    db.close();
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                 }
                 else
                 {
                    console.log(result[0]);
                     if(result[0].password == password)
                     {
                        db.close();
                        var user ={
                                     _id:(result[0]._id),
                                     username:(result[0].username),
                                     password:(result[0].password),
                                     akey:(result[0].akey)
                                    };
                        // all is well, return successful user
                        return done(null, user);
                     }
                     else
                     {
                        // if the user is found but the password is wrong
                        db.close();
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                     }
                 }
             
          });
    }));

};
 