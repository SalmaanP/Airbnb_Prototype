var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./media');

var propertySchema = new Schema({
    propertyId      : {type: String},
    name            : {type: String},
    hostId          : {type: Schema.Types.ObjectId, ref: 'User'},
    mediaId         : {type: Schema.Types.ObjectId, ref: 'Media'},
    category        : {type: String},
    address         : {type: String},
    city            : {type: String},
    state           : {type: String},
    country         : {type: String},
    zip             : {type: String},
    maxGuest        : {type: Number},
    bedrooms        : {type: Number},
    bathrooms       : {type: Number},
    description     : {type: String},
    price           : {type: Number},
    maxBidPrice     : {type: Number},
    biddingDueTime  : {type: Number},
    isBidding       : {type: Boolean},
    isBidCompleted  : {type: Boolean},
    latestBidder    : {type: Schema.Types.ObjectId, ref: 'User'},
    isApproved      : {type: Boolean},
    isAvailable     : {type: Boolean},
    latitude        : {type: String},
    longitude       : {type: String},
    createdDate     : {type: Number},
    revenue         : {type: Number},
    startDate       :{type:String},
    endDate         :{type:String},
    multiplier      :{type:Number}
});
propertySchema.index({city:'text', state:'text'});
var Property = mongoose.model('Property', propertySchema);

module.exports = Property;

