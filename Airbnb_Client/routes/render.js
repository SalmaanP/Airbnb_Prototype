/**
 * Created by Parth on 27-11-2016.
 */
var logger=require('./usertracking');
var mq_client = require('../rpc/client');

function getUserData(request)
{
    var sess = request.session;

    if(sess.isHost == undefined){
        sess.isHost = false;
    }

    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn,
        "firstname" : sess.firstName,
        "userSSN": sess.userSSN,
        "lastName": sess.lastName,
        "userId": sess.userId,
        "isHost": sess.isHost,
        "profileImage":sess.profileImage
    };
    return user_data;
}

exports.renderHomePage = function(req,res){

    var data=getUserData(req);
    logger.info(data.firstname+" clicked on home",{'user':data.firstname,'url_clicked':'/'});
    res.render('homewithoutlogin',data);


};

exports.renderProfilePhotoPage = function(req,res){

    var data=getUserData(req);
    logger.info(data.firstname+" clicked on profilePhotoPage",{'user':data.firstname,'url_clicked':'/getUserPhotoPage'});
    res.render('profile_photo_tab',data);
   };


exports.addListing = function(request, response){
    var data=getUserData(request);
    logger.info(data.firstname+" clicked on addListing",{'user':data.firstname,'url_clicked':'/addListing'});

    response.render("becomehostDescription",data);

};

exports.becomeHost = function(request, response){

    var data=getUserData(request);
    logger.info(data.firstname+" clicked on becomeHost",{'user':data.firstname,'url_clicked':'/becomeHost'});
    response.render("becomeHostMainPage",data);

};

/**
 * Created by Salmaan on 11/21/2016.
 */

exports.header = function(request,response){

    response.render("header");
};

exports.modal = function(request,response){

    response.render("modal");
};

exports.home = function(request, response){

    response.render("home");
};

exports.footer = function(request,response){

    response.render("footer");
};

exports.tripPage = function(request, response){

    var data=getUserData(request);
    logger.info(data.firstname+" clicked on your trips",{'user':data.firstname,'url_clicked':'/yourTrips'});
    response.render("profile_yourTrips",data);

};
exports.editPropertyPage = function (req, res) {

    var data=getUserData(req);
    logger.info(data.firstname+" clicked on edit Listing",{'user':data.firstname,'url_clicked':'/editProperty'});
    res.render('editProperty',data);
};
exports.addProperty = function(request, response){

    response.render("becomehostMainPage",getUserData(request));
};

exports.yourListings = function(request, response){
    var data=getUserData(request);
    logger.info(data.firstname+" clicked on user listing",{'user':data.firstname,'url_clicked':'/yourListings'});

    response.render("profile_activeListings",data);
};

exports.test = function(request, response){

    response.render("viewitinerary", {hello:"hello"});
};



exports.itinerary = function(request, response){

    var data=getUserData(request);
    logger.info(data.firstname+" clicked on itinerary",{'user':data.firstname,'url_clicked':'/itinerary'});
    response.render("viewitinerary",data);
};

exports.userProfile=function(request,response) {
    var data=getUserData(request);
    logger.info(data.firstname+" clicked on profile",{'user':data.firstname,'url_clicked':'/userProfile'});
    response.render("user_profile", data);
};

exports.getEditProfilePage = function (req, res) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on editProfile",{'user':data.firstname,'url_clicked':'/editProfilePage'});
    res.render('profile_edit_profile',data);
};

exports.accountPage = function (req, res, next) {

    var data=getUserData(req);
    logger.info(data.firstname+" clicked on account transactions",{'user':data.firstname,'url_clicked':'/Account_Transactions'});
    res.render('Account_Transactions', data);
};

exports.accountSecurityPage = function (req, res, next) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on account security page",{'user':data.firstname,'url_clicked':'/Account_Security'});
    res.render('Account_Security', data);
};

exports.accountPaymentMethodPage = function (req, res, next) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on account security page",{'user':data.firstname,'url_clicked':'/Account_Payment_Method'});
    res.render('Account_Payment_Method', data);
};

exports.paymentPage = function (req, res, next) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on account security page",{'user':data.firstname,'url_clicked':'/paymentpage'});
    res.render('paymentpage', data);
};

exports.deactivateHost = function (req, res, next) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on deactivateHost",{'user':data.firstname,'url_clicked':'/deactivateHost'});
    res.render('deactivateHost', data);
};

exports.deactivateUser = function (req, res, next) {
    var data=getUserData(req);
    logger.info(data.firstname+" clicked on deactivateUser",{'user':data.firstname,'url_clicked':'/deactivateUser'});
    res.render('deactivateUser', data);
};

exports.pageNotFound = function(req, res){
    var data = getUserData(req);
    res.render('404', data);
};

exports.dashboard = function(req, res){

    var msg_payload = {"userId": req.session.userId};
    var propList = [];

    mq_client.make_request('getActiveListings_queue', msg_payload, function(err, properties){

        var temp = "+";
        console.log(properties.listed);
        var data = getUserData(req);
        for(e in properties.listed){
            temp = '"' + (String(properties.listed[e]._id)) + '"';
            propList.push(temp);
        }
        console.log(propList.join());
        data.properties = propList.join();
        console.log(data);
        res.render('dashboard', data);

    });


};

