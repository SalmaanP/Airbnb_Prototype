var Property = require('../model/property');
var Bidding = require('../model/bidding');
var Trip = require('../model/trip');
var mongoose = require('mongoose');
var ssn = require('ssn');
var ObjectId = require('mongoose').Types.ObjectId;


exports.updateBasePrice = function (msg, callback) {
    var res = {};
    var propertyId = msg.propertyId;
    var maxBidPrice = msg.maxBidPrice;
    var hostId = msg.hostId;
    var latestBidder = msg.latestBidder;
    var userId = msg.userId;
    var currentTime = Date.now();
    Property.update({_id: new ObjectId(propertyId)}, {
        $set: {
            maxBidPrice: maxBidPrice,
            latestBidder: latestBidder
        }
    }, function (err, result) {
        if (err) {
            console.log("err in update",err);
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var bidding = new Bidding();
            bidding.propertyId = propertyId;
            bidding.bidPrice = maxBidPrice;
            bidding.createdDate = currentTime;
            bidding.userId = userId;
            bidding.hostId = hostId;

            bidding.save(function (err) {

                if (err) {
                    console.log(err);
                }
                else {
                    res.code = 200;
                    res.message = "success";
                    callback(null, res);
                }

            });

        }

    });
};

exports.bidCron = function (msg, callback) {

    "use strict";
    console.log("Bid Cron");
    var res = {};
    var currentTime = Date.now();
    Property.find({
        biddingDueTime: {$lte: currentTime},
        isBidding: true,
        isBidCompleted: false
    }, function (err, result1) {

        if (err) {
            throw err;
        }
        else {
            for (let i = 0; i < result1.length; i++) {
                Property
                    .find({_id: new ObjectId(result1[i]._id)})
                    .populate('latestBidder')
                    .exec(function (err, result2) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result2);
                            var trip = new Trip();
                            trip.tripId = ssn.generate();
                            trip.propertyId = result2[0]._id;
                            trip.userId = result2[0].latestBidder._id;
                            trip.hostId = result2[0].hostId;
                            trip.checkIn = result2[0].startDate;
                            trip.checkOut = result2[0].endDate;
                            trip.noOfGuests = result2[0].maxGuest;
                            trip.isAccepted = false;
                            trip.createdDate = currentTime;
                            trip.save(function (err) {

                                if (err) {
                                    console.log(err);
                                }
                                else {

                                    var conditions = {_id: new ObjectId(result2[0]._id)};
                                    var update = {
                                        'isBidCompleted': true,
                                        'isAvailable':false,
                                        'price':result2[0].maxBidPrice

                                    };
                                    Property.update(conditions, update, function (err, result3) {

                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log("Flag Updated");
                                        }
                                    });
                                }

                            });

                        }

                    });

            }
            res.code=200;
            callback(null,res);
        }
    });

};