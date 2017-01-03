/**
 * Created by Parth on 23-11-2016.
 */
var User=require('../model/user');
var UserReview=require('../model/userReview');
var HostReview=require('../model/hostReview');
var mongoose = require('mongoose');

exports.getUserProfile=function(msg,callback) {
    User.findOne({userId: msg.userId}, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(result);
            callback(null, result);
        }
    });
};


exports.getUserReview=function(msg,callback)
{
    UserReview.find({userId: msg.userId}).populate('userId').populate('hostId').exec(function (err,result)
    {
        if(err)
        {
            console.log(err);
            callback(err,null);
        }
        else
        {
            console.log(result);
            callback(null,result);
        }
    });
}

exports.getHostReview=function(msg,callback)
{
    HostReview.find({hostId: msg.hostId}).populate('userId').populate('hostId').exec(function (err,result)
    {
        if(err)
        {
            console.log(err);
            callback(err,null);
        }
        else
        {
            console.log(result);
            callback(null,result);
        }
    });
}

exports.addUserReview=function(msg,callback)
{
    var newReview= new UserReview();
    newReview.userId=mongoose.Types.ObjectId(msg.userId);
    newReview.hostId=mongoose.Types.ObjectId(msg.hostId);
    newReview.review=msg.review;
    newReview.rating=msg.rating;
    newReview.image=msg.image;
    newReview.createdDate=msg.createdDate;
    newReview.save(function (err,result)
    {
       if(err)
       {
           console.log(err);
           callback(err,null);
       }
       else
       {
           console.log(err);
           callback(null,result);
       }
    });
};


exports.addHostReview=function(msg,callback)
{
    var newReview= new HostReview();
    newReview.userId=mongoose.Types.ObjectId(msg.userId);
    newReview.hostId=mongoose.Types.ObjectId(msg.hostId);
    newReview.review=msg.review;
    newReview.rating=msg.rating;
    newReview.imageUrl=msg.imageUrl;
    newReview.createdDate=msg.createdDate;
    newReview.save(function (err,result)
    {
        if(err)
        {
            console.log(err);
            callback(err,null);
        }
        else
        {
            console.log(err);
            callback(null,result);
        }
    });
}

exports.updateUsertoHost=function(msg,callback)
{
    console.log("updateUsertoHost!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    User.findByIdAndUpdate(msg.userId, { isHost: true ,isApproved:false}, function(err, user) {
        if (err)
            callback(err,null);

        else
        {
        console.log("Inside updateUsertoHost request");
        console.log(user);
        callback(null,user);
        }
    });

}

exports.deactivateHost=function (msg,callback)
{
    console.log("Deactivate Host");
    console.log(msg);
    User.findByIdAndUpdate(msg.userId, { isHost: false ,isApproved:false}, function(err, user) {
        if (err)
            callback(err,null);

        else
        {
            console.log("Inside Deactivate host request");
            console.log(user);
            callback(null,user);
        }
    });
}

exports.deactivateUser=function (msg,callback)
{
    console.log("Deactivate user");
    User.findByIdAndUpdate(msg.userId, {isActivated:false}, function(err, user) {
        if (err)
            callback(err,null);

        else
        {
            console.log("Inside Deactivate user request");
            console.log(user);
            callback(null,user);
        }
    });
}