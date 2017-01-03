var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./property');
require('./billing');
var tripSchema = new Schema({
    tripId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    billingId: {type: Schema.Types.ObjectId, ref: 'Billing'},
    checkIn: {type: Number},
    checkOut: {type: Number},
    noOfGuests: {type: Number},
    isAccepted: {type: Boolean},
    createdDate: {type: Number},
    isDeleted:{type: Boolean}

});

var Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;