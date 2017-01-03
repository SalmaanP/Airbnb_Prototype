


var ejs = require("ejs");

exports.homepg = function(req,res){

    var sess = req.session;
    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn,
        "firstname" : sess.firstName
    };
    res.render('homewithoutlogin',user_data);

};