
var bcrypt = require('bcryptjs');


var userReview = require('../model/userReview');
var hostReview = require('../model/hostReview');
var propertyReview = require('../model/propertyReview');
var mongoose = require('mongoose');


exports.loadReviewAboutPage = function (msg, callback) {

    var userId = msg.userId;


    userReview.find({userId: userId}).populate('hostId').exec(function (err, result) {

        if (err) {
            console.log("Getting error in user reviews");
            console.log(err);
            callback(err, null);
        }
        else {

            console.log("USER ID");
            console.log(userId);
            hostReview.find({hostId: userId}).populate('userId').exec(function (err, result1) {

                if (err) {
                    console.log("Getting error in from user reviews");
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log("User/Host Reviews got");
                    console.log(result1);
                    var json = {
                        "fromHostReview": result,
                        "fromUserReview": result1
                    };

                    console.log(json);
                    callback(null, json);
                }
            });
        }
    });
};

exports.loadReviewByPage = function (msg, callback) {

    var userId = msg.userId;


    // review by you to user
    userReview.find({hostId: userId}).populate('userId').exec(function (err, result) {

        if (err) {
            console.log("Getting error in user reviews by page");
            console.log(err);
            callback(err, null);
        } else {
            //reviews by you to host
            hostReview.find({userId: userId}).populate('hostId').exec(function (err, result1) {

                if (err) {
                    console.log("Getting error in from user reviews by page in host");
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log("User/Host Reviews got");
                    console.log(result1);
                    var json = {
                        "toUserReview": result,
                        "toHostReview": result1
                    };

                    console.log(json);
                    callback(null, json);
                }
            });
        }
    });
};

exports.getHostReviewsCount = function (msg, callback) {

    var hostId = msg.hostId;

    hostReview.find({hostId: hostId}).count(function (err, result) {

        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var json = {
                "count": result
            };
            callback(null, json);
        }
    });
};