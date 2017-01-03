/**
 * Created by Parth on 03-12-2016.
 */
var Trip= require('../model/trip');
var Property=require('../model/property');
var Map=require('hashmap');

exports.dynamicPriceCron = function (msg, callback) {


    var makeDate = new Date();
    makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 2)).getTime();
    console.log(new Date(makeDate).toDateString());

    Trip.find({createdDate: {$gt: makeDate}}).populate('propertyId').exec(function (err, result) {

        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {

            //console.log(result);
            var map = new Map();
            var priceMap = new Map();

            for (var i = 0; i < result.length; i++) {


                var propertyId = result[i].propertyId._id.toString();

                if (map.has(propertyId)) {
                    map.set(propertyId, map.get(propertyId) + 1);
                }
                else {
                    map.set(propertyId, 1);
                    priceMap.set(propertyId, result[i].propertyId.price);
                }
            }
            //onsole.log(map);
            var propertyIDArray = [];
            var dynamicMultiplierArray = [];
            //console.log("count " + map.count());
            if (map.count() > 0) {

                map.forEach(function (value, key) {
                    if (value >= 5 && value < 20) {

                        propertyIDArray.push(key);
                        var newMultiplier = 1.2;
                        dynamicMultiplierArray.push(newMultiplier);
                    }
                    else if (value >= 20 && value < 40) {

                        propertyIDArray.push(key);
                        var newMultiplier = Number(priceMap.get(key)) * 1.5;
                        dynamicMultiplierArray.push(newMultiplier);
                    }
                    else if (value >= 40 && value < 50) {
                        propertyIDArray.push(key);
                        var newMultiplier = Number(priceMap.get(key)) * 1.8;
                        dynamicMultiplierArray.push(newMultiplier);
                    }
                    else if (value >= 50) {
                        propertyIDArray.push(key);
                        var newMultiplier = Number(priceMap.get(key)) * 2.0;
                        dynamicMultiplierArray.push(newMultiplier);
                    }
                });
            }
            var bulk = Property.collection.initializeOrderedBulkOp();
           // console.log(bulk);
            for (var i = 0; i < propertyIDArray.length; i++) {

                console.log("Property id " + propertyIDArray[i] + ": " + dynamicMultiplierArray[i]);
                Property.update({_id: propertyIDArray[i]}, {
                    $set: {
                        multiplier: dynamicMultiplierArray[i]
                    }
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }
                    if (!result) {
                        console.log("not updated");
                        console.log(result);
                        callback(null, result);
                    }
                    if (result) {
                        console.log("Updated");
                        console.log(result);
                        callback(null, result);
                    }
                });

            }


        }
    });
};