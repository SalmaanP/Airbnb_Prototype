
var bcrypt = require('bcryptjs');

var User = require('../model/user');
var mongoose = require('mongoose');
var ssn = require('ssn');

exports.doLogin = function (msg, callback) {
    var username = msg.username;
    var password = msg.password;
    console.log("USERNAME: " + username + " PASSWORD: " + password);

    User.findOne({email: username}, function (err, result) {
        if (err) {

            console.log("err in find");
            callback(err, null);
        }

        if (!result) {
            callback(null, null);
        }
        if (result) {
            console.log(result);
            if (bcrypt.compareSync(password, result.password)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        }
    });
};

exports.registerUser = function (msg, callback) {
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var email = msg.email_id;
    var password = msg.password;

    var userDetails = new User();

    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    userDetails.email = email;
    userDetails.password = password;
    userDetails.userId = ssn.generate();
    userDetails.createdDate = new Date().getTime();
    userDetails.isHost = false;
    userDetails.isActivated = true;

    console.log("SSN" + userDetails.userId + email);
    User.findOne({email: email}, function (err, result) {
        if (err) {
            callback(err, null);

        }
        console.log(result);
        if (!result) {
            userDetails.save(function (err) {

                if (err) {

                    callback(err, null);
                }
                else {
                    var id = userDetails._id;
                    console.log("ID " + id);
                    callback(null, userDetails);
                }
            });
        }
        if (result) {
            callback(null, null);
        }
    });
};