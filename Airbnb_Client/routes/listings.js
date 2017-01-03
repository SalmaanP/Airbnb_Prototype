/**
 * Created by Salmaan on 11/22/2016.
 */

var mq_client = require("../rpc/client.js");
var path = require('path');
var imageFolder = path.join(__dirname, '../public/images/user/');
console.log(imageFolder);

exports.getActiveListings = function(request, response){

    var userId = request.session.userId;

    console.log(userId);

    var msg_payload = {userId: userId};

    mq_client.make_request('getActiveListings_queue', msg_payload, function (err, properties) {


        if(!err){
            console.log(properties);
            response.end(JSON.stringify(properties));
        } else {
            console.log(err);
            response.end();
        }


    });




};

exports.uploadVideo=function(request,response)
{
    var video=request.files.file;
    console.log(video);
    var fileName = Date.now()+request.session.userId + '.mp4';
    video.mv(imageFolder + fileName, function (err)
    {
        if (err) {
            console.log("Error in uploading")
            console.log(err);
            response.send({statusCode:401});
        }
        else
        {
            response.send({statusCode:200,url:fileName});
            console.log("File uploaded");
        }
    });
}

exports.getActiveListingsFromId = function(request, response){

    var userId = request.params.userId;

    console.log(userId);

    var msg_payload = {userId: userId};

    mq_client.make_request('getActiveListings_queue', msg_payload, function (err, properties) {


        if(!err){

            response.end(JSON.stringify(properties));
        } else {
            console.log(err);
            response.end();
        }


    });




};

function saveMedia(Media,userId)
{
    var mediaUrls=[];
    for(var i=0;i<Media.length;i++)
    {
        var base64Data = Media[i].replace(/^data:image\/jpeg;base64,/, "");
        var fileName=userId+Date.now()+i+".png";
        mediaUrls.push(fileName);
        require("fs").writeFile(imageFolder +fileName, base64Data, 'base64', function(err) {
            console.log(err);

        });


    }
    console.log(mediaUrls);
    return mediaUrls;
}

exports.removeListing=function(request,response)
{
    var msg_payload=
    {
        "propertyId":request.params.propertyId
    }

    console.log(msg_payload);

    mq_client.make_request('removeListing_queue', msg_payload, function (err, result) {


        if(!err)
        {
            console.log(result);
            response.send(result);
        }
        else
        {
            console.log(err);
            response.send(result);
        }

    });
}

exports.addNewListing=function (request,response)
{
    console.log(request.param("media"));
    console.log(request.param("media").length);
    var mediaUrls=saveMedia(request.param("media"),request.session.userId);
    if(request.param("video"))
    {
        var video=request.param("video");
    }
    else
        var video="";

    var startDate="";
    var endDate="";
    if(request.param("startDate")&&request.param("endDate"))
    {
        startDate=request.param("startDate");
        endDate=request.param("endDate");
    }
    var msg_payload=
    {
        "hostId":request.session.userId,
        "maxGuest":request.param("maxGuest"),
        "propertyType":request.param("propertyType"),
        "roomType":request.param("roomType"),
        "city":request.param("city"),
        "state":request.param("state"),
        "country":request.param("country"),
        "address":request.param("address"),
        "zipCode":request.param("zipCode"),
        "bedrooms":request.param("bedrooms"),
        "beds":request.param("beds"),
        "bathrooms":request.param("bathrooms"),
        "name":request.param("name"),
        "description":request.param("description"),
        "price":request.param("price"),
        "maxBidPrice":request.param("price"),
        "latitude":request.param("latitude"),
        "longitude":request.param("longitude"),
        "createdDate":request.param("createdDate"),
        "isApproved":request.param("isApproved"),
        "isBidding":request.param("isBidding"),
        "media":mediaUrls,
        "video":video,
        "startDate":startDate,
        "endDate":endDate
    }

    console.log(msg_payload);
    mq_client.make_request('addNewListing_queue', msg_payload, function (err, result) {


        if(!err){

            console.log(result);
           if(result.statusCode==200)
           {
              //response.send({result:result});
               updateUserToHost(request,response);
           }
        } else
        {
            console.log(err);
            response.end();
        }


    });

}

function updateUserToHost(request,response)
{
    var msg_payload = {userId: request.session.userId};

    mq_client.make_request('updateUserToHost_queue', msg_payload, function (err, result) {


        if(!err)
        {
            console.log(result);
            response.send({statusCode:200});
        } else
        {
            console.log(err);
            response.end();
        }


    });
}

exports.getReservations = function(request, response){

    var hostId = request.session.userId;

    var msg_payload = {hostId: hostId};

    mq_client.make_request('getReservations_queue', msg_payload, function (err, reservations) {

        if(!err){

            response.end(JSON.stringify(reservations));
        } else {
            console.log(err);
            response.end();
        }

    });
};