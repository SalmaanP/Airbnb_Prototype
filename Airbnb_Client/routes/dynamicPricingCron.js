/**
 * Created by Parth on 03-12-2016.
 */
var mq_client = require('../rpc/client');
var cron = require('node-cron');

cron.schedule('*/600 * * * * *', function (req, res, next) {
    var msg_payload = {};
    mq_client.make_request('dynamicPricingCron_queue', msg_payload, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("dynamic Cron Success");
        }
    });
});