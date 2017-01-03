function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function toDate(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

var app = angular.module('App', ['ngFileUpload']);

app.controller('authentication_controller', function ($scope, $window, $location, $http) {

    $scope.checkLogin = function () {

        var email_id = $scope.email_id;
        var pwd = $scope.password;
        var d = {email_id: email_id, password: pwd};
        $http.post('/signin', d)
            .success(function (data) {
                if (data.success) {
                    $window.location.href = "/";
                    $scope.isWrongCredential = false;
                } else {
                    // $window.location.href = "/login";
                    $scope.isWrongCredential = true;
                }
            })
            .error(function (data) {
                $scope.isWrongCredential = true;
            });
    };

    $scope.registerUser = function () {

        var email_id = $scope.email;
        var pwd = $scope.password;
        var first_name = $scope.first_name;
        var last_name = $scope.last_name;
        if (email_id && pwd && first_name) {
            var d = {email_id: email_id, password: pwd, first_name: first_name, last_name: last_name};
            $http.post('/registerUser', d)
                .success(function (data) {
                    if (data.success) {
                        $window.location.href = "/";
                        $scope.isUserExist = false;
                    } else {
                        $scope.isUserExist = true;
                    }
                })
                .error(function (data) {
                    $scope.isUserExist = true;
                });
        }

    };


});

app.controller('account_user_management', function ($scope, $window, $location, $http) {
    //security code
    $scope.rockerSa = false;
    $scope.rockerSb = true;
    $scope.rockerSo = false;

    $scope.check = function () {
        if ($scope.new_password != $scope.cpassword) {
            $scope.rockerSa = true;
            $scope.rockerSb = false;
        } else {
            $scope.rockerSa = false;
            $scope.rockerSb = true;
        }
    }
    $scope.updatePassword = function () {
        $http({
            method: "POST",
            url: '/updatePassword',
            params: {
                old_password: $scope.old_password,
                new_password: $scope.new_password
            }
        }).success(function (result) {
            if (result == "valid") {
                $scope.rockerSo = false;
                $scope.alert1 = true;
                $window.location.assign('/Account_Security');
            } else if (result == "invalid") {
                $scope.alert1 = false;
                $scope.rockerSo = true;
            }
            console.log("password update API working");
        }).error(function (err) {
            console.log(err);
        })
    }

    //payment code
    $scope.alert2 = false;
    $scope.paymentInit = function () {
        $http({
            method: "GET",
            url: "/cardDetails",
        }).success(function (result) {
            $scope.cname = result[0].firstName + " " + result[0].lastName;
            $scope.cnum = result[0].cardNumber;
            $scope.ccv = result[0].cvv;
            var x = result[0].expDate.split("/");
            $scope.expMonth = x[0];
            $scope.expiryYear = x[1];
        }).error(function (err) {
            console.log(err);
        });
    };
    $scope.creditCard = function () {
        console.log($scope.ccv, $scope.cnum, $scope.expMonth, $scope.expYear);
        $http({
            method: "POST",
            url: '/paymentMethodUpdate',
            params: {
                cvv: $scope.ccv,
                cno: $scope.cnum,
                expm: $scope.expMonth,
                expy: $scope.expYear

            }
        }).success(function (result) {
            if (result == "OK") {
                console.log("ok result");
                $scope.alert2 = true;
                console.log($scope.alert2);
            }
        }).error(function (err) {
            console.log(err);
        })
    }

    //transaction code

    $http({
        method: "GET",
        url: '/payinTransaction',
        params: {}
    }).success(function (result) {
        $scope.payin = result;
        console.log(result);
    }).error(function (err) {
        console.log(err);
    });

    $http({
        method: "GET",
        url: '/payoutTransaction',
        params: {}
    }).success(function (result) {
        $scope.payout = result;
        console.log(result);
    }).error(function (err) {
        console.log(err);
    });

});

app.controller('editUser_controller', function ($scope, $window, $location, $http) {

    console.log("in editUser_controller");

    $scope.loadEditProfilePage = function () {

        $scope.success_model = false;

        $http.post('/loadEditUserPage')
            .success(function (data) {
                if (data.statusCode == 200) {

                    $scope.user = data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else {

                    console.log("Error in loading edit profile page");
                }
            })
            .error(function (data) {

            });


    };


    $scope.uploadProfileImage = function () {

        console.log("upload profile image ::");
        var file = $scope.profileImage;
        console.log(file);
        var uploadUrl = "/uploadProfileImage";

        //fileUpload.uploadFileToUrl(file, uploadUrl);


        $http.post('/uploadProfileImage', file, {'enctype': "multipart/form-data"})
            .success(function (data) {

                console.log("Uploaded");
            })
            .error(function (data) {

                console.log("Not upoaded");

            });


    };


    $scope.saveUserData = function () {

        init();
        console.log("After update");
        console.log($scope.user);
        var validate = true;

        if ($scope.user.firstName == undefined || $scope.user.firstName == "") {
            validate = false;
            $scope.first_invalid = true;
        }

        if ($scope.user.lastName == undefined || $scope.user.lastName == "") {
            validate = false;
            $scope.last_invalid = true;
        }

        if ($scope.user.address == undefined || $scope.user.address == "") {
            validate = false;
            $scope.address_invalid = true;
        }

        if ($scope.user.city == undefined || $scope.user.city == "") {
            validate = false;
            $scope.city_invalid = true;
        }

        if ($scope.user.state == undefined || $scope.user.state == "") {
            validate = false;
            $scope.state_invalid = true;
        }

        if ($scope.user.zip == undefined || $scope.user.zip == "") {
            validate = false;
            $scope.pin_invalid = true;
        }

        if ($scope.user.email == undefined || $scope.user.email == "") {
            validate = false;
            $scope.email_invalid = true;
        }

        if (validate == false) {
            return;
        }

        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.user.zip);

        if (isValidZip) {
        }
        else {
            $scope.pin_wrong = true;
            validate = false;
        }


        if (validate) {

            $http({
                method: "POST",
                url: '/editUser',
                data: {
                    "firstName": $scope.user.firstName,
                    "lastName": $scope.user.lastName,
                    "address": $scope.user.address,
                    "city": $scope.user.city,
                    "state": $scope.user.state,
                    "zip": $scope.user.zip,
                    "email": $scope.user.email
                }
            }).success(function (data) {

                if (data.statusCode == 401) {
                    console.log("status code 401");
                    $scope.fail_model = true;
                }
                else {
                    console.log("statuscode 200");
                    $scope.success_model = true;

                }
            }).error(function (error) {
                console.log(error);
            });

        }
        else {
            console.log("Non Valdate");
        }

    };


    $scope.loadProfilePhotoPage = function () {


        $http.post('/loadProfilePhotoPage')
            .success(function (data) {
                if (data.statusCode == 200) {

                    $scope.user = data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else {

                    console.log("Error in loading profile photo page");
                }
            })
            .error(function (data) {

            });


    };


    function init() {

        $scope.ccv_invalid = false;
        $scope.ccv_wrong = false;
        $scope.expdate_invalid = false;
        $scope.expdate_wrong = false;
        $scope.ccnumber_invalid = false;
        $scope.ccnumber_wrong = false;
        $scope.phone_invalid = false;
        $scope.phone_wrong = false;
        $scope.pin_invalid = false;
        $scope.pin_wrong = false;
        $scope.city_invalid = false;
        $scope.state_invalid = false;
        $scope.address_invalid = false;
        $scope.last_invalid = false;
        $scope.first_invalid = false;
        $scope.bdate_invalid = false;
        $scope.fail_model = false;
        $scope.success_model = false;

    }


});

app.controller('review_controller', ['$scope', 'fileUpload', function ($scope, $window, $location, $http) {

    console.log("in review controller");

    $scope.loadReviewAboutPage = function () {

        $http.post('/loadReviewAboutPage')
            .success(function (data) {

            })
            .error(function (data) {

            });


    };


    $scope.loadReviewAboutPage = function () {

        $http.post('/loadReviewByPage')
            .success(function (data) {

            })
            .error(function (data) {

            });


    };


}]);

app.controller('room_details_controller', function ($scope, $window, $location, $http) {
    var room_id = getParameterByName('propertyId');

    // $scope.checkin = getParameterByName("checkin");
    // $scope.checkout = getParameterByName("checkout");
    // $scope.guests = getParameterByName("guests");
    // var url = "/detail?propertyId=" + room_id;
    var url = "/redisDetail?propertyId=" + room_id;
    $http.get(url).then(function (response) {

        console.log(response);

        if(!response.data)
            $window.location.assign('/404');

        $scope.room_result = response.data;
        if ($scope.room_result.maxBidPrice) {
            $scope.room_result.night = $scope.room_result.maxBidPrice;

        }

        $scope.nightPrice=Math.round($scope.room_result.rooms_price.night*$scope.room_result.rooms_price.multiplier);
        if($scope.room_result.isBidding)
        {
            $scope.nightPrice=Math.round($scope.room_result.rooms_price.maxBidPrice*$scope.room_result.rooms_price.multiplier);
        }
        else
        {
            console.log($scope.room_result.isBidding);
            $scope.nightPrice=Math.round($scope.room_result.rooms_price.night*$scope.room_result.rooms_price.multiplier);

        }
        $scope.videoUrl = "images/user/" + $scope.room_result.video_url;
        url = "/getHostReview/" + $scope.room_result.users.id;
        console.log(url);
        $http.get(url).then(function (response) {
            $scope.hostReviews = response.data.hostReview;
            console.log("host review");

            console.log($scope.hostReviews);
        });
    });

    $scope.removeListing = function () {
        $http
        ({
            method: 'GET',
            url: '/removeListing/' + $scope.room_result.rooms_address.room_id


        }).success(function (data) {
            if (data.statusCode == 200) {
                $window.location.href = '/yourListings';
            }
            else if (data.statusCode == 401) {
                alert("Listing removal failed");
            }
        });
    }

    $scope.redirectEditProperty = function (propId) {
        $window.location.assign("/editProperty?propertyId=" + propId);
    }

    $scope.placeBid = function (bidAmount) {
        $http
        ({
            method: 'POST',
            url: '/updateBasePrice',
            data: {
                "propertyId": $scope.room_result.rooms_address.room_id,
                "maxBidPrice": bidAmount,
                "hostId": $scope.room_result.users.profile_picture.user_id
            }
        }).success(function (data) {
            if (data.statusCode == 200) {
                $window.location.assign('/property?propertyId='+ $scope.room_result.rooms_address.room_id);
            }
        });
    };

    $scope.book = function (checkin, checkout, guests) {

        var days = daydiff(toDate(checkin), toDate(checkout));
        if (days >= 1 && guests >= 1 && guests != undefined) {
            var change_url = "/getPaymentPage?";


            change_url += "propertyId=" + $scope.room_result.id + "&";
            change_url += "checkin=" + checkin + "&";
            change_url += "checkout=" + checkout + "&";
            change_url += "guests=" + guests + "&";
            change_url += "nights=" + days;
            console.log(change_url);
            window.location.href = change_url;
        } else {
            alert("Invalid Entries");
        }
    };

    function daydiff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    $(document).on('click', '.rooms-slider', function () {
        var rooms_id = $(this).attr("data-room_id");
        var img_url = $("#rooms_image_" + rooms_id).attr("src").substr(29);

        console.log($scope.room_result);

        var images = $scope.room_result.images;
        if ($(this).is(".target-prev") == true) {
            var set_img_url = (images) ? ((images.indexOf(img_url) === images.length - 1) ? images[0] : images[images.indexOf(img_url) + 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_" + rooms_id).attr("src", set_img_url);
        } else {
            var set_img_url = (images) ? ((images.indexOf(img_url) === 0) ? images[images.length - 1] : images[images.indexOf(img_url) - 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_" + rooms_id).attr("src", set_img_url);
        }
    });
});

app.controller('payment_controller', function ($scope, $window, $location, $http) {

    var propertyId = getParameterByName("propertyId");
    var guest = getParameterByName("guests");
    var checkin = getParameterByName("checkin");
    var checkout = getParameterByName("checkout");
    var totalperday;
    var days = getParameterByName("nights");

    $scope.loadPaymentPage = function () {
        $http.post('/loadPaymentPage')
            .success(function (data) {
                if (data.statusCode == 200) {
                    console.log("USER");
                    console.log(data.data);
                    var user = data.data;
                    $scope.cardNumber = user.cardNumber;
                    $scope.cvv = user.cvv;
                    $scope.firstName = user.firstName;
                    $scope.lastName = user.lastName;
                    $scope.zip = user.zip;
                    if (user.expDate) {
                        var ccDate = user.expDate.split("/");
                        $scope.expMonth = ccDate[0];
                        $scope.expYear = ccDate[1];
                    }


                } else {
                    console.log("Error occured to get data");
                }
            })
            .error(function (data) {
                console.log("Error to get data");
                console.log(data);
            });

        $http({
            method: "POST",
            url: '/getPropertyDetails',
            data: {
                "propertyId": propertyId
            }
        }).success(function (data) {
            if (data.statusCode == 200) {

                console.log("PROPPERTY");
                console.log(data.data);
                var property = data.data;
                totalperday = property.price;
                $scope.hostId = property.hostId._id;
                $scope.propertName = property.name;
                $scope.location = property.city + ", " + property.state + ", " + property.country;
                $scope.guest = guest;
                $scope.checkin = checkin;
                $scope.checkout = checkout;
                $scope.totalperday = totalperday;
                $scope.multiplier=property.multiplier;
                $scope.days = days;
                $scope.totalwoTax=Math.round($scope.totalperday*$scope.multiplier*$scope.days);
                $scope.totalCost= Math.round($scope.totalperday*$scope.multiplier*$scope.days)+35;
            } else {
                console.log("Error occured to get property data");
            }
        }).error(function (error) {
            console.log(error);
        });
    };

    $scope.confirmBooking = function () {


        $scope.card_wrong = false;
        $scope.dates_wrong = false;
        $scope.cvv_wrong = false;

        var cardnumber = $scope.cardNumber;
        var expMonth = $scope.expMonth;
        var expYear = $scope.expYear;
        var cvv = $scope.cvv;
        var guest1 = guest;
        var checkin1 = checkin;
        var checkout1 = checkout;
        var properyId1 = propertyId;
        var price = totalperday;
        var days1 = days;
        var hostId = $scope.hostId;

        var date = new Date();
        var currMonth = date.getMonth();
        var currYear = date.getFullYear();
        var check = false;


        if (expYear > currYear) {
            check = true;
        }
        else if (expYear == currYear) {
            if (expMonth >= currMonth)
                check = true;
            else
                $scope.dates_wrong = true;

        }
        else {
            $scope.dates_wrong = true;

        }

        if (!validateCardNumber(cardnumber)) {
            $scope.card_wrong = true;
        }

        if (!validateCCV(cvv)) {
            $scope.cvv_wrong = true;
        }

        if (check && validateCardNumber(cardnumber) && validateCCV(cvv)) {
            console.log("aLL CHECKED" + check);

            $http({
                method: "POST",
                url: '/confirmBooking',
                data: {
                    "propertyId": properyId1,
                    "cardNumber": cardnumber,
                    "expMonth": expMonth,
                    "expYear": expYear,
                    "cvv": cvv,
                    "guest": guest1,
                    "checkin": checkin1,
                    "checkout": checkout1,
                    "price": price,
                    "days": days1,
                    "hostId": hostId
                }
            }).success(function (data) {
                if (data.statusCode == 200) {

                    console.log("SAVED TRIP");
                    console.log(data.data);
                    $window.location.assign('/yourTrips');

                } else {
                    console.log("Error occured to booking");
                }
            }).error(function (error) {
                console.log(error);
            });
        }
    };

    function validateCardNumber(number) {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number))
            return false;
        return true;
    }

    function validateCCV(number) {
        var regex = new RegExp("^[0-9]{3}$");
        if (!regex.test(number))
            return false;
        return true;
    }
});

app.controller('editProperty_controller', function ($scope, $http, $window) {

    console.log("in edit property controller");
    console.log();
    var propertyId = "";

    $scope.loadEditPropertyPage = function () {


        propertyId = $window.location.search.split('=')[1];

        $http.get('/getEditPropertyPage/' + propertyId)
            .success(function (data) {

                if (data.code == 200) {

                    $scope.result = data.data;
                    console.log("Data is :")
                    console.log($scope.result);

                    $scope.propertyId = data.data[0].propertyId;
                    $scope.propertyObjectId = data.data[0]._id;
                    $scope.maxGuest = data.data[0].maxGuest;
                    $scope.category = data.data[0].category;
                    $scope.address = data.data[0].address,
                        $scope.city = data.data[0].city,
                        $scope.state = data.data[0].state,
                        $scope.zip = data.data[0].zip,
                        $scope.bedrooms = data.data[0].bedrooms,
                        $scope.bathrooms = data.data[0].bathrooms,
                        $scope.name = data.data[0].name,
                        $scope.description = data.data[0].description,
                        $scope.price = data.data[0].price,
                        $scope.createdDate = data.data[0].createdDate,
                        $scope.isApproved = data.data[0].isApproved,
                        $scope.latitude = data.data[0].latitude,
                        $scope.longitude = data.data[0].longitude,
                        $scope.isBidding = data.data[0].isBidding


                }
                else {

                    console.log("Error in loading edit profile page");
                }
            })
            .error(function (data) {
                console.log(data);
                console.log("Error");

            });


    };

    $scope.editProperty = function () {
        $http
        ({
            method: 'POST',
            url: '/editProperty',
            data: {
                "maxGuest": $scope.maxGuest,
                "category": $scope.category,
                "address": $scope.address,
                "city": $scope.city,
                "state": $scope.state,
                "country": $scope.country,
                "zip": $scope.zip,
                "bedrooms": $scope.bedrooms,
                "bathrooms": $scope.bathrooms,
                "name": $scope.name,
                "description": $scope.description,
                "price": $scope.price,
                "createdDate": Date.now() / 1000,
                "isApproved": false,
                "propertyId": propertyId

            }
        }).success(function (data) {
            console.log(data)

            if (data.code == 200) {

                console.log("edit property controller function")
                $scope.result = data.data;

                var nextUrl = "/property?propertyId=" + $scope.propertyObjectId;
                $window.location.assign(nextUrl);
            }
        });
    }


});


app.factory('Data', function ($window) {

    return {
        getData: function () {
            return $window.sessionStorage.getItem("Data");
        },
        setData: function (data) {
            $window.sessionStorage.setItem("Data", JSON.stringify(data));
        },
        clearData: function () {
            $window.sessionStorage.clear();
        },

    };
});

app.directive("fileread", function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var readers = [],
                    files = changeEvent.target.files,
                    datas = [];
                for (var i = 0; i < files.length; i++) {
                    readers[i] = new FileReader();
                    readers[i].onload = function (loadEvent) {
                        datas.push(loadEvent.target.result);
                        if (datas.length === files.length) {
                            scope.$apply(function () {
                                scope.fileread = datas;
                            });
                        }
                    }
                    readers[i].readAsDataURL(files[i]);
                }
            });

        }
    }
});

app.controller('addListing_controller', function ($scope, $http, Data, $window, Upload) {


    $scope.formData = Data.getData();
    console.log($scope.formData);
    var address = JSON.parse($scope.formData).address.split(",");
    Data.clearData();
    $scope.address_1 = address[0];
    $scope.city = address[address.length - 3];
    $scope.state = address[address.length - 2];
    $scope.country = address[address.length - 1];
    $scope.photosDiv = true;
    $scope.locationDiv = true;
    $scope.pricingDiv = true;
    $scope.calendarDiv = true;
    $scope.basicsDiv = false;
    $scope.descriptionDiv = true;
    $scope.photoP = true;
    $scope.videoDisp = true;
    $scope.biddingDiv = true;
    $scope.biddingChange = function () {
        if ($scope.bidding == true) {
            $scope.biddingDiv = false;
        }
        else {
            $scope.biddingDiv = true;
        }

    }


    $scope.validateBasicsDiv=function ()
    {
        if($scope.bathrooms&&$scope.beds&&$scope.bedrooms)
        {
            $scope.selectDescriptionDiv();
            $scope.basicsIncomplete=false;
        }
        else
        {
            $scope.basicsIncomplete=true;
        }
    }

    $scope.validateDescriptionDiv=function ()
    {
        if($scope.name&&$scope.summary)
        {
            $scope.selectLocationDiv();
            $scope.descriptionIncomplete=false;
        }
        else
        {
            $scope.descriptionIncomplete=true;
        }
    }

    $scope.validateLocationDiv=function ()
    {
        if($scope.pinCode)
        {
            $scope.selectPhotosDiv();
            $scope.locationIncomplete=false;
        }
        else
        {
            $scope.locationIncomplete=true;
        }
    }

    $scope.validatePricingDiv=function ()
    {
        if($scope.base_price)
        {
            $scope.pricingIncomplete=false;
        }
        else
        {
            $scope.pricingIncomplete=true;
        }
        if($scope.bidding==true)
        {
            if($scope.startDate&&$scope.endDate)
            {
                $scope.biddingIncomplete=false;
            }
            else
            {
                $scope.biddingIncomplete=true;
            }
        }
        else
        {
            $scope.biddingIncomplete=false;
        }
        if($scope.pricingIncomplete==false&&$scope.locationIncomplete==false&&$scope.descriptionIncomplete==false&&$scope.basicsIncomplete==false&&$scope.biddingIncomplete==false)
        {
            $scope.addNewListing();
        }
        else
        {
            $scope.finalSteps=true;
        }
    }

    $scope.loadPhotos = function () {
        console.log($scope.photosList);
        $scope.photoP = false;

    };

    $scope.loadVideo = function () {
        console.log($scope.video);
        $scope.videoDisp = false;
    };
    $scope.selectBasicsDiv = function () {
        $scope.basicsDiv = false;
        $scope.locationDiv = true;
        $scope.photosDiv = true;
        $scope.descriptionDiv = true;
        $scope.pricingDiv = true;
        $scope.calendarDiv = true;
    };

    $scope.selectLocationDiv = function () {
        $scope.basicsDiv = true;
        $scope.locationDiv = false;
        $scope.photosDiv = true;
        $scope.descriptionDiv = true;
        $scope.pricingDiv = true;
        $scope.calendarDiv = true;
    };

    $scope.selectDescriptionDiv = function () {
        $scope.basicsDiv = true;
        $scope.locationDiv = true;
        $scope.photosDiv = true;
        $scope.descriptionDiv = false;
        $scope.pricingDiv = true;
        $scope.calendarDiv = true;
    };

    $scope.selectPhotosDiv = function () {
        $scope.basicsDiv = true;
        $scope.locationDiv = true;
        $scope.photosDiv = false;
        $scope.descriptionDiv = true;
        $scope.pricingDiv = true;
        $scope.calendarDiv = true;
    };

    $scope.selectPricingDiv = function () {
        $scope.basicsDiv = true;
        $scope.locationDiv = true;
        $scope.photosDiv = true;
        $scope.descriptionDiv = true;
        $scope.pricingDiv = false;
        $scope.calendarDiv = true;
    };

    $scope.selectCalendarDiv = function () {
        $scope.basicsDiv = true;
        $scope.locationDiv = true;
        $scope.photosDiv = true;
        $scope.descriptionDiv = true;
        $scope.pricingDiv = true;
        $scope.calendarDiv = false;
    };

    $scope.addNewListing = function () {
        if (!$scope.photosList)
            $scope.photosList = "";
        if (!$scope.videoUrl)
            $scope.videoUrl = "";

        $http
        ({
            method: 'POST',
            url: '/addNewListing',
            data: {

                "media": $scope.photosList,
                "video": $scope.videoUrl,
                "maxGuest": JSON.parse($scope.formData).accommodates,
                "roomType": JSON.parse($scope.formData).roomType,
                "propertyType": JSON.parse($scope.formData).propertyType,
                "address": $scope.address_1,
                "city": $scope.city,
                "state": $scope.state,
                "country": $scope.country,
                "zipCode": $scope.pinCode,
                "bedrooms": $scope.bedrooms,
                "beds": $scope.beds,
                "bathrooms": $scope.bathrooms,
                "name": $scope.name,
                "description": $scope.summary,
                "price": $scope.base_price,
                "latitude": JSON.parse($scope.formData).latitude,
                "longitude": JSON.parse($scope.formData).longitude,
                "createdDate": Date.now(),
                "isApproved": false,
                "isBidding": $scope.bidding,
                "startDate": $scope.startDate,
                "endDate": $scope.endDate

            }
        }).success(function (data) {
            if (data.statusCode == 200) {
                $window.location.assign("yourListings");
            }
        });
    };


    $scope.testData = function () {
        var data =
            {

                media: $scope.photosList,
                video: $scope.videoUrl,
                maxGuest: JSON.parse($scope.formData).accommodates,
                roomType: JSON.parse($scope.formData).roomType,
                propertyType: JSON.parse($scope.formData).propertyType,
                address: $scope.address_1,
                city: $scope.city,
                state: $scope.state,
                country: $scope.country,
                zipCode: $scope.pinCode,
                bedrooms: $scope.bedrooms,
                beds: $scope.beds,
                bathrooms: $scope.bathrooms,
                name: $scope.name,
                description: $scope.summary,
                price: $scope.base_price,
                latitude: JSON.parse($scope.formData).latitude,
                longitude: JSON.parse($scope.formData).longitude,
                createdDate: Date.now() / 1000,
                isApproved: false,
                isBidding: $scope.bidding,
                startDate: $scope.startDate,
                endDate: $scope.endDate

            }
        console.log(data);
        var d = new Date($scope.startDate);

        console.log(d.getUTCDate());
    }
    /*Video upload*/
    $scope.submit = function () {
        if ($scope.video) {
            $scope.upload($scope.video);
        }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/uploadVideo',
            data: {
                file: file
            }
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.videoUrl = resp.data.url;
        }, function (resp) {
            console.log('Error status: ' + resp.statusCode);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


});

app.controller('addProperty_controller', function ($scope, $http, Data, $window) {


    $http({
        method: 'GET',
        url: '/getSession'
    }).success(function (data) {
        if (data.isLoggedIn == undefined) {
            $window.location.assign("/");
        }
        else {
            console.log(data.isLoggedIn);
            console.log(data);
            console.log("user logged in");
        }
    });

    $scope.accommodates_value = 1;
    $scope.city_show = false;
    var i = 0;

    $scope.city_rm = function () {
        $scope.city_show = false;
    };

    $scope.property_type = function (id, name, icon) {
        $scope.property_type_id = id;
        $scope.selected_property_type = name;
        $scope.property_type_icon = icon;
        $('.fieldset_property_type_id .active-selection').css('display', 'block');
    };

    $scope.property_type_rm = function () {
        $scope.property_type_id = '';
        $scope.selected_property_type = '';
        $scope.property_type_icon = '';
    };

    $scope.property_change = function (value) {
        $scope.property_type_id = value;
        $scope.selected_property_type = $('#property_type_dropdown option:selected').text();
        $scope.property_type_icon = $('#property_type_dropdown option:selected').attr('data-icon-class');
        $('.fieldset_property_type_id .active-selection').css('display', 'block');
    };

    $scope.room_type = function (id, name, icon) {
        $scope.room_type_id = id;
        $scope.selected_room_type = name;
        $scope.room_type_icon = icon;
        $('.fieldset_room_type .active-selection').css('display', 'block');
    };

    $scope.room_type_rm = function () {
        $scope.room_type_id = '';
        $scope.selected_room_type = '';
        $scope.room_type_icon = '';
    };
    $scope.room_change = function (value) {
        $scope.room_type_id = value;
        $scope.selected_room_type = $('#room_type_dropdown option:selected').text();
        $scope.room_type_icon = $('#room_type_dropdown option:selected').attr('data-icon-class');
        $('.fieldset_room_type .active-selection').css('display', 'block');
    };

    $scope.change_accommodates = function (value) {
        $scope.selected_accommodates = value;
        $('.fieldset_person_capacity .active-selection').css('display', 'block');
        i = 1;
    };

    $scope.accommodates_rm = function () {
        $scope.selected_accommodates = '';
    };

    $scope.city_click = function () {
        if (i == 0)
            $scope.change_accommodates(1);
    };

    initAutocomplete(); // Call Google Autocomplete Initialize Function

// Google Place Autocomplete Code

    var autocomplete;
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'short_name',
        postal_code: 'short_name'
    };

    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('location_input'));
        autocomplete.addListener('place_changed', fillInAddress);
    }

    function fillInAddress() {
        $scope.city = '';
        $scope.state = '';
        $scope.country = '';

        var place = autocomplete.getPlace();

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];

                if (addressType == 'street_number')
                    $scope.street_number = val;
                if (addressType == 'route')
                    $scope.route = val;
                if (addressType == 'postal_code')
                    $scope.postal_code = val;
                if (addressType == 'locality')
                    $scope.city = val;
                if (addressType == 'administrative_area_level_1')
                    $scope.state = val;
                if (addressType == 'country')
                    $scope.country = val;
            }
        }
        var address = $('#location_input').val();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();

        $scope.address = address;
        $scope.city_show = true;
        $scope.latitude = latitude;
        $scope.longitude = longitude;
        $scope.$apply();
        $('.fieldset_city .active-selection').css('display', 'block');
    }

    $scope.saveFormData = function () {
        var data =
            {
                "accommodates": $scope.accommodates_value,
                "roomType": $scope.selected_room_type,
                "propertyType": $scope.selected_property_type,
                "address": $scope.address,
                "latitude": $scope.latitude,
                "longitude": $scope.longitude
            }
        Data.setData(data);
        $window.location.assign('addListing');
    }


});

app.controller('itinerary_controller', function ($scope, $http, $window) {

    var tripId = getParameterByName("tripId");
    console.log(tripId);
    $http.get('/itinerary/' + tripId)
        .success(function (data) {
            console.log(data);
            var info = data;
            $scope.trips = info.trip;
            $scope.bills = info.bill;
        })
        .error(function (data) {
            console.log(data);
        });


});

app.controller('profile_controller', function ($scope, $http, $window) {

    $scope.numberOfTotalReviews = 0;


    var userSSN = window.location.pathname.split('/')[2] || "Unknown";
    console.log(userSSN);
    if (userSSN == "Unknown") {

        console.log('ok');
        // $window.location.href = '/home';

    } else {


        $http({
            method: 'GET',
            url: '/getUserProfile/' + userSSN
        })
            .success(function (data) {


                if(data.user) {
                    $scope.user = data.user;
                    $scope.getUserReview($scope.user._id);
                    $scope.getHostReview($scope.user._id);
                    $scope.getProperties($scope.user._id);
                } else {
                    $window.location.assign('/404');
                }

            });


        $scope.getUserReview = function (userId) {
            $http({
                method: 'GET',
                url: '/getUserReview/' + userId
            })
                .success(function (data) {
                    console.log(data);
                    $scope.userReviews = data.userReview;
                    $scope.numberOfUserReviews = $scope.userReviews.length;
                    $scope.numberOfTotalReviews = $scope.numberOfTotalReviews + $scope.numberOfUserReviews;
                });
        };

        $scope.getHostReview = function (userId) {
            $http({
                method: 'GET',
                url: '/getHostReview/' + userId
            })
                .success(function (data) {
                    // console.log(data);
                    $scope.hostReviews = data.hostReview;
                    console.log($scope.hostReviews);
                    $scope.numberOfHostReviews = $scope.hostReviews.length;
                    $scope.numberOfTotalReviews = $scope.numberOfTotalReviews + $scope.numberOfHostReviews;
                });
        };

        $scope.getProperties = function (userId) {

            $http({
                method: 'GET',
                url: '/getActiveListings/' + userId
            })
                .success(function (data) {
                    console.log(data);
                    $scope.listed = data.listed;
                    $scope.unlisted = data.unlisted;
                    $scope.pending = data.pending;
                    $scope.numberOfProperties = $scope.listed.length;

                });


        };


        // app.get('/getUserProfile/:userId', users.getUserProfile);
        // app.get('/getUserReview/:userId', users.getUserReview);
        // app.get('/getHostReview/:hostId', users.getHostReview);
    }

});

app.controller('activeListings_controller', function ($scope, $http, $window) {

    console.log("hi");
    $scope.activeListings = true;
    $scope.pendingListings = false;
    $scope.reservationListings = false;
    $scope.unapprovedReservationListings = false;
    $scope.pastText = "View Past Reservations";

    $scope.loadListing = function () {
        console.log("loading listings");
        $http({
            method: 'GET',
            url: '/getActiveListings'
        }).success(function (data) {
            $scope.listed = data.listed;
            $scope.unlisted = data.unlisted;
            $scope.pending = data.pending;
            console.log(data);

        }).error(function (err) {
            console.log(err);
        });

        $http({
            method: 'GET',
            url: '/getReservations'
        })
            .success(function (data) {
                $scope.upcoming = data.upcoming;
                $scope.past = data.past;
                $scope.unapproved = data.unapproved;
                console.log(data);
                for(var i=0;i<$scope.unapproved.length;i++)
                {
                    $scope.unapproved[i].days=Math.round(($scope.unapproved[i].checkOut-$scope.unapproved[i].checkIn)/(1000*60*60*24));
                    $scope.unapproved[i].total=Math.round($scope.unapproved[i].days*$scope.unapproved[i].propertyId.price*$scope.unapproved[i].propertyId.multiplier);
                }
                for(var i=0;i<$scope.upcoming.length;i++)
                {
                    $scope.upcoming[i].days=Math.round(($scope.upcoming[i].checkOut-$scope.upcoming[i].checkIn)/(1000*60*60*24));
                    $scope.upcoming[i].total=Math.round($scope.upcoming[i].days*$scope.upcoming[i].propertyId.price*$scope.upcoming[i].propertyId.multiplier);
                }

            });
    }

    $scope.acceptTrip = function (tripId) {

        console.log(tripId);

        $http({
            method: 'POST',
            url: '/acceptTrip',
            data: {"tripId": tripId}
        })
            .then(function success(data) {

                    $window.location.href = "/yourListings";
                },
                function error(err) {
                    console.log(err);

                })

    };

    $scope.clickPending = function () {
        $scope.activeListings = false;
        $scope.pendingListings = true;
        $scope.reservationListings = false;
        $scope.unapprovedReservationListings = false;
    };

    $scope.clickActive = function () {
        $scope.activeListings = true;
        $scope.pendingListings = false;
        $scope.reservationListings = false;
        $scope.unapprovedReservationListings = false;
    };

    $scope.clickReservation = function () {
        $scope.activeListings = false;
        $scope.pendingListings = false;
        $scope.reservationListings = true;
        $scope.unapprovedReservationListings = false;
    };

    $scope.clickUnapprovedReservation = function () {
        $scope.activeListings = false;
        $scope.pendingListings = false;
        $scope.reservationListings = false;
        $scope.unapprovedReservationListings = true;
    };

    $scope.clickPast = function () {

        $scope.showPast = !$scope.showPast;
        if ($scope.pastText == "View Past Reservations")
            $scope.pastText = "Hide Past Reservations";
        else
            $scope.pastText = "View Past Reservations";
    };

    $scope.toggleReview = function () {

        $scope.writeReview = !$scope.writeReview;
    };

    $scope.submitReview = function (review, userId, rating, photosList) {


        if (!review) {
            console.log('No Review');
            return;
        }
        var reviewid = userId;
        console.log(reviewid);
        console.log(rating);
        console.log(review, userId);
        $http({
            method: 'POST',
            url: '/addUserReview',
            data: {"userId": reviewid, "review": review, "rating": rating, "photosList": photosList}
        })
            .success(function (data) {
                console.log(data);
                alert("Review added");
                $window.location.assign('/yourListings');
            })
    };

});

app.controller('yourTrips_controller', function ($scope, $http, $sce,$window) {

    $scope.isItinerary = false;
    $scope.toggle = [];

    $http({
        method: 'GET',
        url: '/getUserTrips'
    })
        .success(function (data) {
            console.log(data);
            $scope.trips = data;
        });


    $scope.deleteTrip=function(tripId)
    {
        $http({
            method: 'POST',
            url: '/deleteTrip',
            data: {"tripId": tripId}
        })
            .success(function (data) {
               console.log(data);
                if(data.statusCode=200)
                    $window.location.assign('/yourTrips');
                if(data.statusCode=401)
                    console.log("failed");
            });
    }

    $scope.viewItinerary = function (tripId) {

        $http({
            method: 'POST',
            url: '/itinerary',
            data: {"tripId": tripId}
        })
            .success(function (data) {
                $scope.isItinerary = true;
                console.log(data);
                $scope.tripItinerary = $sce.trustAsHtml(data);
            })

    };

    $scope.toggleReview = function () {

        $scope.writeReview = !$scope.writeReview;
    };

    $scope.submitReview = function (review, userId, rating, photosList) {


        if (!review) {
            console.log('No Review');
            return;
        }

        console.log(rating);
        console.log(review, userId);
        $http({
            method: 'POST',
            url: '/addHostReview',
            data: {"hostId": userId, "review": review, "rating": rating, "photosList": photosList}
        })
            .success(function (data) {
                console.log(data);
                alert("Review added");
                $window.location.assign('/yourTrips');
            })
    };


});

app.controller('header_controller', function ($scope, $http, Data) {

    $scope.isLoggedIn = false;

    $http({
        method: 'GET',
        url: '/getSession'
    })
        .success(function (data) {
            $scope.isLoggedIn = data.isLoggedIn;
            $scope.session_email = data.email;
            $scope.session_firstname = data.firstName;
            $scope.session_lastname = data.lastName;
            $scope.session_userSSN = data.userSSN;
            $scope.session_userId = data.userId;

            if (data.isHost == true)
                $scope.isHostString = "Add a Listing";
            else
                $scope.isHostString = "Become a Host";

            console.log($scope.session_firstname);
        });


    console.log("in header");

});


app.controller('deactivateHostController', function ($scope, $http, $window)
{

    $scope.deactivateHost=function()
    {
        $http({
            method: 'POST',
            url: '/deactivateHost',
        })
            .success(function (data) {
                if(data.statusCode==200)
                {
                    alert("Your host account is deactivated, please login to continue");
                    $window.location.assign("/");
                }
            })
    }
});

app.controller('deactivateUserController', function ($scope, $http, $window)
{

    $scope.deactivateUser=function()
    {
        $http({
            method: 'POST',
            url: '/deactivateUser',
        })
            .success(function (data) {
                alert("Your user account is deactivated :-(");
                $window.location.assign("/");
            })
    }
});

app.controller('search-page', ['$scope', '$http', '$compile', '$filter', function ($scope, $http, $compile, $filter) {

    $scope.current_date = new Date();
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];

    function no_results() {
        if ($('.search-results').hasClass('loading'))
            $('#no_results').hide();
        else
            $('#no_results').show();
    }

    var location1 = getParameterByName('location');


    var current_url = (window.location.href).replace('/search', '/searchResult');


    $(document).ready(function () {
        localStorage.removeItem("map_lat_long");
        var room_type = [];
        $('.room-type:checked').each(function (i) {
            room_type[i] = $(this).val();
        });


        $('.search-results').addClass('loading');
        no_results();
        $http.get(current_url).then(function (response) {
            // $scope.room_result = response;
            $('.search-results').removeClass('loading');
            no_results();
            $scope.room_result = response.data;
            $scope.totalPages = response.data.last_page;
            $scope.currentPage = response.data.current_page;
            $scope.checkin = getParameterByName("checkin");
            $scope.checkout = getParameterByName("checkout");
            $scope.guests = getParameterByName("guests");
            $scope.room_type = getParameterByName("room_type");
            var room_type = getParameterByName("room_type").split(',');

            for (var i = 0; i < room_type.length; i++) {
                switch (room_type[i]) {
                    case "Entire home/apt":
                        $scope.room_type_1 = true;
                        break;
                    case "Private room":
                        $scope.room_type_2 = true;
                        break;
                    case "Shared room":
                        $scope.room_type_3 = true;
                        break;
                    default:
                        $scope.room_type_1 = false;
                        $scope.room_type_2 = false;
                        $scope.room_type_3 = false;

                }
            }
            initialize(response.data);

//            marker(response.data);
        });
        var location_val = $("#location").val();
        $("#header-search-form").val(location_val);

    });


    function initialize(response) {

        var latitude = $("#lat").val();
        var longitude = $("#long").val();

        var myOptions = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        setMarkers(map, response)
        // marker(map,response);

    }

    function setMarkers(map, response) {

        var marker;
        var data = response.data;
        var guests = 1;
        for (var i = 0; i < data.length; i++) {

            var name = data[i].name;
            var lat = Number(data[i].rooms_address.latitude);
            var lon = Number(data[i].rooms_address.longitude);
            var labelTxt = "$" + data[i].rooms_price.night;
            latlngset = new google.maps.LatLng(lat, lon);

            /*
             var image = {
             url: 'images/locate-pin.png',
             size: new google.maps.Size(32, 32),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(0, 32)
             };
             var shape = {
             coords: [1, 1, 1, 20, 18, 20, 18, 1],
             type: 'poly'
             };
             */

            var marker = new MarkerWithLabel({
                position: latlngset,
                map: map,
                // label: labelTxt,
                // labelContent: labelTxt,
                // labelAnchor: new google.maps.Point(18, 65),
                // labelClass: "labels", // the CSS class for the label
                // labelInBackground: false,
                icon: '/images/red-dot.png',
                // animation: google.maps.Animation.DROP,




                // draggable: true,
                // raiseOnDrag: true,

                labelContent: "<div class='arrow'></div><div style='font-size:14px;' class='inner'><strong>"+labelTxt+"</strong></div>",
                labelAnchor: new google.maps.Point(33, 60),
                labelClass: "labels", // the CSS class for the label
                isClicked: false

            });

            map.setCenter(marker.getPosition());

            var html = '<div id="info_window_' + data[i].id + '" class="listing listing-map-popover" data-price="' + data[i].rooms_price.currency.symbol + '" data-id="' + data[i].id + '" data-user="' + data[i].user_id + '"  data-name="' + data[i].name + '" data-lng="' + data[i].rooms_address.longitude + '" data-lat="' + data[i].rooms_address.latitude + '"><div class="panel-image listing-img">';
            html += '<a class="media-photo media-cover" target="listing_' + data[i].id + '" ><div class="listing-img-container media-cover text-center"><img id="marker_image_' + data[i].id + '" rooms_image = "" alt="' + data[i].name + '" class="img-responsive-height" data-current="0" src="' + APP_URL + '/images/user/' + data[i].photo_name + '"></div></a>';
            html += '<a class="link-reset panel-overlay-bottom-left panel-overlay-label panel-overlay-listing-label" target="listing_' + data[i].id + '" ><div>';

            var instant_book = '';

            if (data[i].booking_type == 'instant_book')
                instant_book = '<span aria-label="Book Instantly" data-behavior="tooltip" class="h3 icon-beach"><i class="icon icon-instant-book icon-flush-sides"></i></span>';

            html += '<sup class="h6 text-contrast">' + data[i].rooms_price.currency.symbol + '</sup><span class="h3 text-contrast price-amount">' + data[i].rooms_price.night + '</span><sup class="h6 text-contrast"></sup>' + instant_book + '</div></a></div>';
            html += '<div class="panel-body panel-card-section"><div class="media"><h3 class="h5 listing-name text-truncate row-space-top-1" itemprop="name" title="' + data[i].name + '">' + name + '</a></h3>';

            var star_rating = '';

            if (data[i].overall_star_rating != '')
                star_rating = ' · ' + data[i].overall_star_rating;

            var reviews_count = '';
            var review_plural = (data[i].reviews_count > 1) ? 's' : '';

            if (data[i].reviews_count != 0)
                reviews_count = ' · ' + data[i].reviews_count + ' review' + review_plural;

            html += '<div class="text-muted listing-location text-truncate" itemprop="description"><a class="text-normal link-reset" >' + data[i].room_type_name + star_rating + reviews_count + '</a></div></div></div></div>';

            createInfoWindow(marker, html, map);

        }
    }

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "ff0000");

    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 2
        };
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function setGetParameter(paramName, paramValue) {
        var url = window.location.href;

        if (url.indexOf(paramName + "=") >= 0) {
            var prefix = url.substring(0, url.indexOf(paramName));
            var suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            url = prefix + paramName + "=" + paramValue + suffix;
        }
        else {
            if (url.indexOf("?") < 0)
                url += "?" + paramName + "=" + paramValue;
            else
                url += "&" + paramName + "=" + paramValue;
        }
        history.pushState(null, null, url);
    }

    function createInfoWindow(marker, popupContent, map) {
        infoBubble = new InfoBubble({
            maxWidth: 3000
        });

        var contentString = $compile(popupContent)($scope);
        google.maps.event.addListener(marker, 'click', function () {

            if (infoBubble.isOpen()) {
                infoBubble.close();
                return;
            }

            infoBubble = new InfoBubble({
                maxWidth: 3000
            });

            infoBubble.addTab('', contentString[0]);

            var borderRadius = 0;
            infoBubble.setBorderRadius(borderRadius);
            var maxWidth = 300;
            infoBubble.setMaxWidth(maxWidth);

            var maxHeight = 300;
            infoBubble.setMaxHeight(maxHeight);
            var minWidth = 282;
            infoBubble.setMinWidth(minWidth);

            var minHeight = 245;
            infoBubble.setMinHeight(minHeight);

            infoBubble.open(map, marker);
        });
    }

    $scope.apply_filter = function () {
        $scope.search_result();
    };


    $scope.search_result = function () {

        var room_type = [];
        $('.room-type:checked').each(function (i) {
            room_type[i] = $(this).val();
        });
        //alert(room_type);
        if (room_type == '') {
            $('.room-type_tag').addClass('hide');
        }

        var checkin = $('#checkin').val();
        var checkout = $('#checkout').val();
        var guest_select = $("#guest-select").val();

        setGetParameter('room_type', room_type);
        setGetParameter('checkin', checkin);
        setGetParameter('checkout', checkout);
        setGetParameter('guests', guest_select);


        var location1 = getParameterByName('location');

        $('.search-results').addClass('loading');
        no_results();
        var change_url = "/search?";
        change_url += "location=" + location1 + "&";
        change_url += "room_type=" + room_type + "&";
        change_url += "checkin=" + checkin + "&";
        change_url += "checkout=" + checkout + "&";
        change_url += "guests=" + guest_select;
        var encoded_url = encodeURI(change_url);
        window.location.href = encoded_url;

    };

    $(document).on('click', '.rooms-slider', function () {
        var rooms_id = $(this).attr("data-room_id");
        var img_url = $("#rooms_image_" + rooms_id).attr("src").substr(29);
        var room;
        for (var i = 0; i < $scope.room_result.data.length; i++) {
            var temp = $scope.room_result.data[i];
            if (temp.id === rooms_id) {
                room = temp;
                break;
            }
        }
        var images = room.images;
        if ($(this).is(".target-prev") == true) {
            var set_img_url = (images) ? ((images.indexOf(img_url) === images.length - 1) ? images[0] : images[images.indexOf(img_url) + 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_" + rooms_id).attr("src", set_img_url);
        } else {
            var set_img_url = (images) ? ((images.indexOf(img_url) === 0) ? images[images.length - 1] : images[images.indexOf(img_url) - 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_" + rooms_id).attr("src", set_img_url);
        }
    });
}]);