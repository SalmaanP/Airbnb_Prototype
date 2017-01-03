var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userReviewSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    review: {type: String},
    rating: {type: Number},
    image: {type: String},
    createdDate: {type: Number}
});

var UserReview = mongoose.model('UserReview', userReviewSchema);
module.exports = UserReview;