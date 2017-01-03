var path = require('path');
var imageFolder = path.join(__dirname, '../public/images/user/');
var mq_client = require("../rpc/client.js");
exports.getUserProfile=function(request,response) {
  var userId = request.params.userId;
  console.log(userId);
  var msg_payload =
  {
    userId: userId
  };
  mq_client.make_request('getUserProfile_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      console.log(result);
      response.send({user:result});
    }

  });
};

exports.getUserReview=function(request,response)
{
  var userId = request.params.userId;
  var msg_payload =
  {
    userId: userId
  }
  mq_client.make_request('getUserReview_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      response.send({userReview:result});
    }

  });
}

exports.getHostReview=function(request,response)
{
  var hostId = request.params.hostId;
  var msg_payload =
  {
    hostId: hostId
  }
  mq_client.make_request('getHostReview_queue', msg_payload, function (err, result) {

    if (err) {
      console.log(err);
    }
    else
    {
      response.send({hostReview:result});
    }

  });
}


exports.addUserReview=function(request,response)
{
  var imageUrl=saveMedia(request.body.photosList,request.session.userId);
  var msg_payload=
  {
    userId:request.body.userId,
    hostId:request.session.userId,
    review:request.body.review,
    rating:request.body.rating,
    image:imageUrl,
    createdDate:Date.now()
  }

  mq_client.make_request('addUserReview_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      response.send({statusCode:200});
    }

  });
}


exports.addHostReview=function(request,response)
{
  var imageUrls=saveMedia(request.body.photosList,request.session.userId);
  var msg_payload=
  {
    userId:request.session.userId,
    hostId:request.body.hostId,
    review:request.body.review,
    rating:request.body.rating,
    imageUrl:imageUrls,
    createdDate:Date.now()
  }

  mq_client.make_request('addHostReview_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      response.send({statusCode:200});
    }

  });
}

exports.deactivateHost=function(request,response)
{
  var userId=request.session.userId;
  var msg_payload=
  {
    userId:userId
  }

  mq_client.make_request('deactivateHost_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      request.session.destroy();
      response.send({statusCode:200});
    }

  });
}

exports.deactivateUser=function(request,response)
{
  var userId=request.session.userId;
  var msg_payload=
  {
    userId:userId
  }

  mq_client.make_request('deactivateUser_queue', msg_payload, function (err, result) {

    if (err)
    {
      console.log(err);
      response.send({statusCode:401});
    }
    else
    {
      request.session.destroy();
      response.send({statusCode:200});
    }

  });
}

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