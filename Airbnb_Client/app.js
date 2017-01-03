var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require("connect-mongo")(session);
var mongo = require("mongodb").MongoClient;
var fileUpload = require('express-fileupload');
var routes = require('./routes/index');
var users = require('./routes/users');
var signin = require('./routes/signin');
var home = require('./routes/home');
var account = require('./routes/account');
var search = require('./routes/search');
var review = require('./routes/review');
var property = require('./routes/property');
var account_management = require('./routes/account_management');
var render = require('./routes/render');
var listings = require('./routes/listings');
var trips = require('./routes/trips');
var bid = require('./routes/bid');
var cronBid = require('./routes/cronBid');
var dynamicPricing=require('./routes/dynamicPricingCron');
var winstonLogger=require('./routes/usertracking');
var biddingLogger=require('./routes/biddingLogger');




var app = express();
app.use(fileUpload());
app.use(passport.initialize());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: "mongodb://airbnb:airbnb@ds035796.mlab.com:35796/airbnb17"
    })
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb"}, {extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/dashboard',render.dashboard);
app.post('/signin', signin.authenticateUser);
app.get('/', render.renderHomePage);
app.get('/login', signin.loginpg);
app.get('/signout', signin.signout);
app.post('/registerUser', signin.registerUser);
app.get('/searchResult', search.search);
app.get('/search', search.loadSearchPg);


app.post('/uploadVideo', listings.uploadVideo);
app.post('/editUser', account.editUser);
app.get('/editProfilePage', render.getEditProfilePage);
app.get('/getUserPhotoPage', render.renderProfilePhotoPage);
app.get('/getUserReviewAboutPage', account.getUserReviewAboutPage);
app.get('/getUserReviewbyPage', account.getUserReviewbyPage);
app.post('/loadEditUserPage', account.loadEditUserPage);
app.get('/Account_Transactions', render.accountPage);
app.get('/Account_Security', render.accountSecurityPage);
app.get('/Account_Payment_Method', render.accountPaymentMethodPage);
app.get('/payinTransaction', account_management.payinTransactions);
app.get('/payoutTransaction', account_management.payoutTransactions);
app.post('/updatePassword', account_management.updatePassword);
app.post('/paymentMethodUpdate', account_management.updatePaymentMethod);

app.post('/editProperty', property.editProperty);

app.get('/getEditPropertyPage/:propertyId', property.getEditPropertyPage);

app.get('/property', property.loadDetailPg);
app.get('/detail', property.getProperty);
app.get('/redisDetail', property.getPropertyRedis);

app.get('/yourTrips', render.tripPage);
app.get('/getUserTrips', trips.getUserTrips);
app.get('/addProperty', render.addProperty);
app.get('/yourListings', render.yourListings);
app.get('/getActiveListings', listings.getActiveListings);
app.get('/getActiveListings/:userId', listings.getActiveListingsFromId);
app.get('/getReservations', listings.getReservations);
app.post('/acceptTrip', trips.acceptTrip);
app.post('/deleteTrip',trips.deleteTrip);

app.get('/profile/*', render.userProfile);
app.get('/getUserProfile/:userId', users.getUserProfile);
app.get('/getUserReview/:userId', users.getUserReview);
app.get('/getHostReview/:hostId', users.getHostReview);
app.get('/becomeHost', render.becomeHost);
app.get('/editProperty', render.editPropertyPage);
app.get('/deactivateHost',render.deactivateHost);
app.post('/deactivateHost',users.deactivateHost);
app.get('/deactivateUser',render.deactivateUser);
app.post('/deactivateUser',users.deactivateUser);
app.get('/getPaymentPage', render.paymentPage);
app.post('/loadPaymentPage', account.loadPaymentPage);
app.post('/getPropertyDetails', account.getPropertyDetails);
app.post('/confirmBooking', account.confirmBooking);

app.get('/receipt/:tripId', account_management.receiptPage);

app.get('/itinerary/:tripId', trips.displayItinerary);
app.get('/itinerary', render.itinerary);

app.get('/addListing', render.addListing);
app.post('/addNewListing', listings.addNewListing);
app.get('/removeListing/:propertyId',listings.removeListing);

app.post('/addUserReview', users.addUserReview);
app.post('/addHostReview', users.addHostReview);

app.get('/hostReviewsCount', review.getHostReviewsCount);
app.post('/loadReviewAboutPage', review.loadReviewAboutPage);
app.post('/loadReviewByPage', review.loadReviewAboutPage);
app.post('/uploadProfileImage', account.uploadProfileImage);
app.post('/loadProfilePhotoPage', account.loadProfilePhotoPage);
app.get('/getDashBoardPage', account.getDashBoardPage);
app.get('/cardDetails', account_management.cardDetails);


app.get('/mongooseProperty', property.mongooseProperty);
app.get('/dashboard',render.dashboard);


app.post('/updateBasePrice', bid.updateBasePrice);

app.get('/getSession', function (request, response) {
    response.send(JSON.stringify(request.session));
});


app.get('/signin', isAuthenticated, function (req, res) {
    res.redirect('/');
});
function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        console.log(req.session.user_id);
        return next();
    }
    res.redirect('/signinPg');
}


app.get('/404', function(req, res){
   res.render('404', req.session);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
        res.render('404', req.session);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
