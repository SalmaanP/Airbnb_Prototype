var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billingSchema = new Schema({
    billingId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'property'},
    hostId: {type: Schema.Types.ObjectId, ref: 'user'},
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    fromDate: {type: Number},
    toDate: {type: Number},
    total: {type: Number},
    createdDate: {type: Number}

});

var Billing = mongoose.model('billing', billingSchema,'billing');
module.exports = Billing;