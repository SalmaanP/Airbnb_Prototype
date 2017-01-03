

var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require('ejs');

exports.loadReviewAboutPage = function (req, res) {


    var userId = req.session.userId;

    var msg_payload = {

        userId: userId
    };


    mq_client.make_request('loadReviewAboutPage_queue', msg_payload, function (err, user) {
        if (err) {

            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();

        } else {

            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode": 200};
            res.send(json_responses);
            res.end();

        }
    });


};


exports.loadReviewByPage = function (req, res) {


    var userId = req.session.userId;

    var msg_payload = {

        userId: userId
    };


    mq_client.make_request('loadReviewByPage_queue', msg_payload, function (err, user) {
        if (err) {

            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();

        } else {

            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode": 200};
            res.send(json_responses);
            res.end();

        }
    });
};

exports.getHostReviewsCount = function (req, res) {

    var hostId = req.param("hostId");

    var msg_payload = {
        hostId: hostId
    };

    mq_client.make_request('hostReviewsCount_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
            res.send({"statusCode": 401});
            res.end();

        } else {
            res.send(result);
        }
    });
};