var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propertySchema = new Schema({
    propertyId: {type: String},
    name: {type: String},
    hostId: {type: Schema.Types.ObjectId, ref: 'user'},
    mediaId: {type: Schema.Types.ObjectId, ref: 'media'},
    category: {type: String},
    address: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    zip: {type: String},
    maxGuest: {type: Number},
    bedrooms: {type: Number},
    bathrooms: {type: Number},
    description: {type: String},
    price: {type: Number},
    maxBidPrice: {type: Number},
    biddingDueTime: {type: Number},
    isBidding: {type: Boolean},
    isBidCompleted: {type: Boolean},
    latestBidder: {type: String},
    isApproved: {type: Boolean},
    isAvailable: {type: Boolean},
    latitude: {type: String},
    longitude: {type: String},
    createdDate: {type: Number}
});

propertySchema.index({address: 'text', city: 'text', state: 'text', country: 'text', zipcode: 'text'});

var Property = mongoose.model('property', propertySchema, 'property');
module.exports = Property;