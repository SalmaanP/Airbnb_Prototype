/**
 * Created by Salmaan on 11/21/2016.
 */

var mq_client = require("../rpc/client.js");

exports.getUserTrips = function(request, response){


    var userId = request.session.userId;
    // var userId = 'ObjectId("5833baaecbf1171f6806c745")';

    var msg_payload = {userId: userId};

    mq_client.make_request('getUserTrips_queue', msg_payload, function (err, trips) {

        if(!err){
            console.log(trips);
            for(var i=0;i<trips.length;i++)
            {

                if(trips[i].isAccepted)
                {
                    trips[i].isAccepted="Accepted";
                }
                else
                {
                    trips[i].isAccepted="Pending";
                }

            }
            response.end(JSON.stringify(trips));
        }

    });

};

exports.acceptTrip = function(request, response){

    var tripId = request.body.tripId;
    console.log(request.body);
    var hostId = request.session.userId;

    var msg_payload = {tripId: tripId, hostId: hostId};

    mq_client.make_request('acceptTrip_queue', msg_payload, function (err, result) {

        if (!err && result.code == 200) {

            console.log('done');
            response.status(200);
            response.end();
        } else {
            response.status(400);
            response.end();
        }
    });


};

exports.displayItinerary = function(request, response){


    var tripId = request.params.tripId;
    var userId = request.session.userId;

    var msg_payload = {tripId: tripId, userId: userId};

    mq_client.make_request('getItinerary_queue', msg_payload, function (err, trips) {

        if(!err){

            if(trips)
                response.end(JSON.stringify(trips));
            else
                response.end();
        }


    });


};

exports.loadItinerary = function (request, response) {
    var tripId = request.body.tripId;
    var userId = request.session.userId;
    var msg_payload = {tripId: tripId, userId: userId};

    mq_client.make_request('getItinerary_queue', msg_payload, function (err, trips) {
        if (!err) {
            if (trips) {
                response.end(trips);
            } else {
                response.end();
            }
        } else {
            response.status(400);
            response.end();
        }
    });
};

exports.deleteTrip=function(request,response)
{
    var msg_payload=
    {
        "tripId":request.param("tripId")
    }
    mq_client.make_request('deleteTrip_queue', msg_payload, function (err, result) {
        if (!err)
        {
            if(result.statusCode=200)
            {
                console.log(result);
                response.send(result);

            }
            else
            {
                response.send({statusCode:401});
            }
        }
        else
        {
            console.log(err);
            response.status(400);
            response.end();
        }
    });

}