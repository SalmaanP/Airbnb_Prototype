/**
 * Created by Parth on 03-12-2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dynamicPrice = new Schema({
    propertyId: {type: Schema.Types.ObjectId, ref: 'property'},
    bookedCount: {type: Number}
});
var DynamicPrice = mongoose.model('DynamicPrice', dynamicPrice);
module.exports = DynamicPrice;