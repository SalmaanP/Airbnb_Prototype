
var bcrypt = require('bcryptjs');

var User = require('../model/user');
var Billing = require('../model/billing');
var mongoose = require('mongoose');
var ssn = require('ssn');
var ObjectId = require('mongoose').Types.ObjectId;

exports.updatePassword = function (msg, callback) {
    var opass = msg.old_password;
    var npass = msg.new_password;
    var username = msg.email;
    console.log(opass, npass);
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
            if (bcrypt.compareSync(opass, result.password)) {
                //if(opass===result.password){
                var salt = bcrypt.genSaltSync(10);
                var passwordToSave = bcrypt.hashSync(npass, salt);
                User.update({email: username}, {$set: {password: passwordToSave}}, function (err, user) {
                    if (err) {
                        callback(err, null);
                    }
                    else if (user) {
                        var res = {};
                        console.log("updateProfile queue");
                        res.code = 200;
                        callback(null, res);
                    }
                });
            } else {
                callback(null, null);
            }
        }

    });
};

exports.updatePaymentMethod = function (msg, callback) {
    var cvv = msg.cvv;
    var cnos = Number(msg.cno);
    var edate = msg.expm +"/"+ msg.expy;
    console.log(msg.expm+"  "+msg.expy);
    var username = msg.email;
    console.log(username);
    console.log(cvv, cnos, edate);
    User.update({_id: msg.userId}, {$set: {cardNumber: cnos, cvv: cvv, expDate: edate}}, function (err, result) {
        if (err) {
            console.log("err in update");
            console.log(err);
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log("updateProfile queue");
            res.code = 200;
            callback(null, res);
        }

    });
};

exports.payinTransactions = function (msg, callback) {

    console.log("pay in transaction service");

    Billing.find({hostId: new ObjectId(msg.uid)}).populate('propertyId').populate('userId').exec(function (err, result) {
        if (err) {
            console.log("err in update");
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log("pay out transaction");
            console.log(result);
            res.code = 200;
            res.data = result;
            callback(null, res);
        }

    });
};

exports.payoutTransactions = function (msg, callback) {

    console.log("pay out transaction service");

    Billing.find({userId: new ObjectId(msg.uid)}).populate('propertyId').populate('hostId').exec(function (err, result) {
        if (err) {
            console.log("err in update");
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log(result);
            console.log("pay out transaction");
            res.code = 200;
            res.data = result;
            callback(null, res);
        }

    });
};
exports.receiptPage = function (msg, callback) {
    console.log("receiptPage service");
    Billing.find({tripId: msg.tripId}).populate('propertyId').populate('hostId').populate('userId').populate('tripID').exec(function (err, result) {
        if (err) {
            console.log("err in billing receipt");
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log(result);
            console.log("receipt result");
            res.code = 200;
            res.data = result;
            callback(null, res);
        }
    });
};
exports.cardDetails = function (msg, callback) {
    console.log("cardDetails service");
    User.find({email: msg.uid}).cache(300).exec(function (err, result) {
        if (err) {
            console.log("err in update");
            callback(err, null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log("cardDetails queue");
            res.code = 200;
            res.data = result;
            console.log(result);
            callback(null, res);
        }
    });
};