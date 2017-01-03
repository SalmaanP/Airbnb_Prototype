var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./property');
require('./trip');

var billingSchema = new Schema({
    billingId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    tripId: {type: Schema.Types.ObjectId, ref: 'Trip'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Number},
    fromDate: {type: Number},
    toDate: {type: Number},
    total: {type: Number},
    price:{type:Number},
    multiplier:{type:Number},
    days: {type: Number},
    createdDate: {type: Number}

});

var Billing = mongoose.model('Billing', billingSchema);
module.exports = Billing;