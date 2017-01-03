
var bcrypt = require('bcryptjs');
var express = require('express');

var ejs = require("ejs");
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var logger=require("../routes/usertracking");
/*var log = require("./log");*/
/*
 var mongo = require("./mongo");
 var config = require('./config.js');
 */
var passport = require("passport");
require('./passport')(passport);


exports.loginpg = function (req, res) {
    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName
    };
    ejs.renderFile('../views/login.ejs', user_data, function (err, result) {
        if (err) {

        } else {

        }
        res.end(result);
    });
};

exports.authenticateUser = function (req, res, next) {

//	var email_id = req.body.email_id;
//	var pwd = req.body.password;
    var sess = req.session;
    sess.isLoggedIn = false;
    console.log("in signin");
    passport.authenticate('login', function (err, user) {
        console.log("Result" + user);
        if (err) {
            return next(err);
        }

        if (!user) {

            res.json({
                success: false,
                message: 'No user found'
            });
            res.end();
            /*return res.redirect('/signup');*/
        }

        if (user) {

            if(user.isActivated==false)
            {
                res.json({
                    success: false,
                    message: 'No user found'
                });
                res.end();
            }
            logger.info(user.firstName+" logged in",{'user':user.firstName,'url_clicked':'/'});
            sess.email =user.email;
            sess.isLoggedIn = true;
            sess.userSSN=user.userId;
            sess.firstName=user.firstName;
            sess.lastName=user.lastName;
            sess.userId=user._id;
            sess.isHost = user.isHost;
            if(user.profileImage)
            sess.profileImage=user.profileImage;
            else
                sess.profileImage="";



            // sess.last_name = user.last_name;
            // sess.user_id = user._id;
            // // sess.last_access = user.last_access;

//		        res.statusCode = 200;
            res.json({
                success: true,
                message: 'Logged in'
            });
            res.end();
        }
    })(req, res, next);
};

exports.signout = function (req, res) {
    req.session.destroy();
    res.redirect("/");
};


exports.registerUser = function (req, res) {

    var f_name = req.body.first_name;
    var l_name = req.body.last_name;
    var email_id = req.body.email_id;
    var pwd = req.body.password;
    var sess = req.session;
    sess.isLoggedIn = false;
    var salt = bcrypt.genSaltSync(10);
    var passwordToSave = bcrypt.hashSync(pwd, salt);
    var msg_payload = {
        firstName: f_name,
        lastName: l_name,
        email_id: email_id,
        password: passwordToSave
    };

    mq_client.make_request('register_queue', msg_payload, function (err, results) {
        if (err) {
            res.json({
                success: false,
                message: 'Error in registration.'
            });
            res.end();
        }
        if (results) {

            sess.userSSN = results.userId;
            sess.firstName = results.firstName;
            sess.lastName = results.lastName;
            sess.userId = results._id;
            sess.email = results.email;
            sess.isLoggedIn = true;
            res.json({
                success: true,
                message: 'Registered'
            });
            res.end();
        } else {
            res.json({
                success: false,
                message: 'User exist'
            });
            res.end();
        }
    });

};




	