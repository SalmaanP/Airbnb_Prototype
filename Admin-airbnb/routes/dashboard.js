var Billing = require('../model/billing');
var Property = require('../model/property');
var User = require('../model/user');
var mongoose = require('mongoose');

exports.topTenProperties = function (req, res, next) {
    "use strict";
    var flag = false;
    var response = {};
    response.propertyName = [];
    response.revenue = [];
    Property
        .find({})
        .sort("-revenue")
        .limit(10)
        .exec(function (err, properties) {

            for (let i = 0; i < properties.length; i++) {
                Billing.aggregate([{
                    $match: {
                        propertyId: properties[i]._id
                    }
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$total"
                        }
                    }
                }], function (err, revenue) {
                    if (err) {
                        console.log(err);
                    }
                    response.propertyName.push(properties[i].name);
                    if (revenue.length > 0) {
                        response.revenue.push(revenue[0].total);
                        flag = true;
                    }

                });

            }
            setTimeout(function (flag) {
                res.send(response);

            }, 500);
        });
};

exports.cityRevenue = function (req, res, next) {
    Property.aggregate([{
        $group: {
            _id: "$city",
            revenue: {
                $sum: "$revenue"
            }
        }
    }], function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log("cityRevenue "+result);
        res.send(result);

    });
};

exports.topTenHost = function (req, res, next) {
    var response = {};
    response.hostName = [];
    response.revenue = [];
    Property.aggregate([{
        $group: {
            _id: "$hostId",
            revenue: {
                $sum: "$revenue"
            }
        }
    }, {
        $sort: {
            revenue: -1
        }
    }, {
        $limit: 2
    }

    ], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result){
            User.populate(result, {
                path: '_id'
            }, function (err, results) {
                for (var i = 0; i < results.length; i++) {
                    if(results[i]._id) {
                        console.log(results[i]);
                        var name = results[i]._id.firstName + " " + results[i]._id.lastName;
                        response.hostName.push(name);
                        response.revenue.push(results[i].revenue);
                    }
                }
                res.send(response);
            });
    } else{
            console.log($hostId);
        }
    });
};

exports.totalUsers = function (req, res, next) {
    var response = {};
    console.log("Call is made to totalUsers Node.js");
    User
        .find({isHost: false, isActivated: true})
        .count()
        .exec(function (err, result) {
            response.totalUsers = result;
            console.log("In here " + result);
            res.send(response);
        });

};

exports.totalHosts = function (req, res, next) {
    var response = {};

    User
        .find({isHost: true, isApproved: true, isActivated: true})
        .count()
        .exec(function (err, result) {
            response.totalH = result;
            res.send(response);
        });

};

exports.totalProperties = function (req, res, next) {
    var response = {};

    Property
        .find({isApproved: true})
        .count()
        .exec(function (err, result) {
            response.totalProperties = result;
            res.send(response);
        });

};

exports.totalBills = function(req, res, next){
    var response={};

    Billing
        .count()
        .exec(function(err, result){
            console.log("Total bills "+result);
            response.totalbill = result;
            res.send(response);
        });
};

exports.totalRevenue = function (req, res, next) {
    var response = {};
    Property.aggregate([{
        $group: {
            _id: null,
            total: {
                $sum: "$revenue"
            }
        }
    }], function (err, totalRevenue) {
        if (err) {
            console.log(err);
        }
        else {
            response.totalRevenue = totalRevenue[0].total;
            res.send(response);
        }
    });
};

exports.admin_dashboard = function (req, res) {
    res.render('admin_dashboard');
};