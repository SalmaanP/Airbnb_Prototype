/**
 * Created by Shrey on 11/28/2016.
 */
var Property=require('../model/property');

var mongoose = require('mongoose');

exports.editProperty=function(msg,callback)
{

    console.log("In edit property service");
    var res = {};
    var conditions = msg.conditions;
    var update = msg.update;
    Property.update(conditions,update,function (err, results) {
        if (err){
            console.log("Error updating property");
            res.code = "0";
        }
        else if (results) {

            console.log("Property update successfull");
            res.code = "200";
            res.data = results;
        }
        callback(null, res);

    });
}

exports.getDatainEditProperty=function(msg,callback)
{

    console.log("In get data in edit property service");
    var res = {};
    var id = msg.id;


    Property.find({ propertyId:id}, function(err, results) {
        if (err){
            console.log("Error fetching  Info");
            res.code = "0";
        }
        else if (results) {

            console.log("display successfull in edit property");
            res.code = "200";
            res.data = results;

        } else {
            console.log("data not found");
            res.code = "400";
        }

        callback(null, res);

    });
}

