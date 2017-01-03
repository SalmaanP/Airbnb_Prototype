var Billing = require('../model/billing');
var User = require('../model/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

exports.invoices = function (req, res, next) {

    Billing
        .find({})
        .populate('propertyId')
        .populate('hostId')
        .populate('userId')
        .exec(function (err, invoices) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(invoices);
            }


        });
};

exports.getInvoice = function (req, res) {
    console.log("Getting one invoice");
    var invoiceId = req.param("_id");
    var conditions = {_id: new ObjectId(invoiceId)};
    Billing.find({_id: conditions})
            .populate('hostId')
            .populate('userId')
            .populate('propertyId')
            .exec(function (err, results) {
        if (err) {
            throw err;
        } else {

console.log(results);
            res.send(results);
        }
    })

};

exports.deleteBill = function(req, res){
    console.log("Deleting one bill");
    var invoiceId = req.param("_id");
    var conditions = {_id: new ObjectId(invoiceId)};
    Billing.remove({_id:conditions}).exec(function(err, results){
        if(err){
            throw err;
        }else{
            console.log("Bill deleted" + results);
            res.send();
            //res.render('admin_invoiceManagement');
        }
    })
};



exports.admin_invoiceManagement = function (req, res) {
    res.render('admin_invoiceManagement');
};