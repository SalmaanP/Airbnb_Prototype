var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema({
    tripId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'property'},
    userId: {type: String, ref: User},
    hostId: {type: String, ref: User},
    billingId: {type: Schema.Types.ObjectId, ref: 'billing'},
    checkIn: {type: Number},
    checkOut: {type: Number},
    noOfGuests: {type: Number},
    isAccepted: {type: Boolean},
    createdDate: {type: Number}

});

var Trip = mongoose.model('trip', tripSchema,'trip');
module.exports = Trip;