var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hostReviewSchema = new Schema({
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    review: {type: String},
    rating: {type: Number},
    imageUrl: {type: String},
    createdDate: {type: Number}

});

var HostReview = mongoose.model('HostReview', hostReviewSchema);
module.exports = HostReview;