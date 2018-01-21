/* Firebase Setup*/
var config = {
    apiKey: "AIzaSyBp2o8Zp8sIcnByeq62HHt2zRHWeGxbRpw",
    authDomain: "matrimonial-c8a00.firebaseapp.com",
    databaseURL: "https://matrimonial-c8a00.firebaseio.com",
    projectId: "matrimonial-c8a00",
    storageBucket: "",
    messagingSenderId: "4034774784"
};
firebase.initializeApp(config);
firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        var token = result.credential.accessToken;
        var user = result.user;
        serverAuth(user);
    }
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
});
document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    var notificationOpenedCallback = function(jsonData){
        if(jsonData.hasOwnProperty('notification')){
            if(jsonData.notification.hasOwnProperty('payload')){
                if(jsonData.notification.payload.hasOwnProperty('additionalData')){
                    var data = jsonData.notification.payload.additionalData;
                    if(data.hasOwnProperty('type')){
                        switch(data.type){
                            case 1:
                                $(".downtime-website-name").html(data.website_name);
                                $(".downtime-time").html(data.down_time);
                                $.mobile.changePage("#"+data.page_to_show);
                            break;
                        }
                    }
                }
            }
        }
    };
    window.plugins.OneSignal.startInit("998cc2ea-1737-448d-bded-e2312a542d62").handleNotificationOpened(notificationOpenedCallback).endInit();
}, false);
/* Main variables declaration */
var signUpForm,
    signInForm,
    apptoken,
    defaultWebsiteScreenshot = 'images/default-website.jpg',
    defaultPhotoUrl = 'images/default-profile.png',
    defaultAnimationTime = 500,
    loaderImage = 'images/ajax-loader.gif',
    updateProfileSection,
    updatePasswordSection,
    setPasswordSection,
    updateProfileForm,
    passwordChangeForm,
    newTicketForm,
    // stripePublicKey = 'pk_test_9wbnzfCi0N7dlsBh3RBugJKx',
    stripePublicKey = 'pk_live_JBN7txLriZLaZzqBkpw8vtGo',
    subscriptionChangeForm,
    subscriptionCreateForm
    isLoggedIn=false;
var storage = window.localStorage;
try{
    var userObject = storage.getItem('userObject');
    apptoken = storage.getItem('apptoken');
    if(userObject != null){
        userObject = parseJSON(userObject);
        if(userObject.hasOwnProperty('displayName')){
            document.addEventListener("deviceready", function(){
                initializeUser(userObject);
            },false);
        }
    }
}catch(err){
    swal(err.message);
    navigator.app.exitApp();
}
var serverBaseURL = 'https://matrimonial.giftmeindia.com/';
var appRoutes = {
    "auth" : "app/user/token/get",
    "oauth" : "app/oauth/token/get",
    "profile" : "app/user-details",
    "update-profile" : "app/profile/update",
    "signup" : "app/register-user",
    "login" : "app/user/token/get",
    "websites-list" : "app/websites/all",
    "all-tickets" : "app/all-tickets",
    "website-details" : "app/website-details/",
    "ticket-details" : "app/ticket-details",
    "payment-history" : "app/user/payment-history",
    "password-reset" : "app/profile/update-password",
    "password-set" : "app/user/set-password",
    "user-cards" : "app/user/cards",
    "activity-log" : "app/activity-log",
    "change-website-plan" : "app/subscription/update",
    "register-onesignal-id":"app/user/onesignal",
    "register-source":"app/user/sources/add",
    "create-subscription" : "app/subscription/create",
    "current-website-status" : "app/user/websites-current-status",
    "image-upload" : "app/user/profile-picture/upload",
    "create-new-ticket" : "app/user/ticket/new",

    "reply-to-ticket" : "app/"
};
function handleOpenURL(url){
  // navigator.splashscreen.show();
  //swal("App was opened by URL: " + url);
}
function parseJSON(a){
    if(typeof a =='object'){
        return a;
    }else{
        return JSON.parse(a);
    }
}
/* Variables initialisation & event Bindings*/
$(document).ready(function(){
    /* Start Document ready */
    $('.social-login-button').unbind().on('click',function(event){
        event.preventDefault();
        oAuthLogin($(this).data('provider'));
    });
    $(".profile-page a.read-more").on('click',function () {
        $('.profile-page').toggleClass('closeimg');
    });
    /*
    signUpForm = $('#sign-up-form');
    signUpForm.parsley();
    signUpForm.submit(function(event){ event.preventDefault();signUpFunction();});
    signInForm = $('#sign-in-form');
    signInForm.parsley();
    signInForm.submit(function(event){ event.preventDefault();signInFunction();});
    updateProfileForm = $('#update-profile-form');
    updateProfileForm.submit(function(event){ event.preventDefault();profileChangeFunction(); });
    passwordChangeForm = $('#password-change-form');
    passwordSetForm = $('#password-set-form');
    passwordChangeForm.submit(function(event){ event.preventDefault();passwordChangeFunction(); });
    passwordSetForm.submit(function(event){ event.preventDefault();passwordSetFunction(); });
    updateProfileSection = $('#update-profile-section');
    updatePasswordSection = $('#change-password-section');
    setPasswordSection = $('#set-password-section');
    $(".maincontain").unbind();
    $('.toggle-password-visibility').on('click',function(){
        var input = $(this).parent().find('.password-input');
        if(input.attr('type') === "password"){
            input.attr('type','text');
        }else{
            input.attr('type','password');
        }
    });
    $("#patient_pic").on('change',function(){
        var file_data = $('#patient_pic').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: serverBaseURL+appRoutes['image-upload'], // point to server-side PHP script
            data: form_data,
            type: 'POST',
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,
            success: function (data) {
                // console.log(data);
                $('#profile-image-url').val(data);
                $('#preview_image').attr('src',data);
            }
        });
    });*/
    /* End Document ready */
});
$(document).ajaxSend(function () {
    $('#loader-div-overlay').fadeIn();
});
$(document).ajaxStop(function () {
    $('#loader-div-overlay').fadeOut();
});
$(document).bind('pagebeforechange', function(e, data) {
    var to = data.toPage,
        from = data.options.fromPage;
    if (typeof to === 'string') {
        var u = $.mobile.path.parseUrl(to);
        to = u.hash || '#' + u.pathname.substring(1);
        if (from) from = '#' + from.attr('id');
        if (to === '#login' || to === '#signup' || to === '#welcome') {
            if(isLoggedIn){
                e.preventDefault();
                $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active');
                //If is logged in then prevent user to change from any page to welcome,login or signup
            }
        }
    }
});
$(document).on("pagechange",function(event,options){
    var toPage = options.toPage[0]['id'];

    switch(toPage){
        case 'account':
            loadProfileDetails();
        break;


    }
});
function backTo(pageName){
    $.mobile.changePage(pageName,{reverse:true}); //add options for animation type back   
}
function oAuthLogin(provider){
    var providerObject = "";
    if(provider == 'google'){
        providerObject = new firebase.auth.GoogleAuthProvider();
        providerObject.addScope('profile');
    }else if(provider == 'facebook'){
        providerObject = new firebase.auth.FacebookAuthProvider();
        providerObject.addScope('public_profile');
    }else if(provider == 'twitter'){
        providerObject = new firebase.auth.TwitterAuthProvider();
    }
    if(providerObject != ""){
        firebase.auth().signInWithRedirect(providerObject).then(function() {
          firebase.auth().getRedirectResult().then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            userObject = user;
            if(user.email == null){
                swal("No email found!","No email registered with "+provider+". Please choose an account with a valid email id, or else create a new PressMate account.","error");
            }else{
                serverOauth(user);
            }
          }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
          });
        });     
    }
}
function serverOauth(user){
    $.ajax({
        url:serverBaseURL+appRoutes.oauth,
        data:{user:JSON.stringify(user)},
        beforeSend:function(){
            navigator.splashscreen.show();
        },
        success:function(response){
            if(response.status == 'success'){
                initializeUser(response.user);
                window.plugins.OneSignal.syncHashedEmail(response.user.email);
            }else{
                swal("","Server Authorization Error occurred. Please try again in some time.","error");
                navigator.app.exitApp();
            }
            navigator.splashscreen.hide();
        },
        error:function(error){
            //navigator.splashscreen.hide();
            swal("","Server Authorization Error occurred. Please try again in some time.","error");
            navigator.app.exitApp();
        }
    });
}

function serverAuth(user){
    $.ajax({
        cors:true,
        url:serverBaseURL+appRoutes.auth,
        data:{user:JSON.stringify(user)},
        beforeSend:function(){
            navigator.splashscreen.show();
        },
        success:function(response){
            if(response.status == 'success'){
                initializeUser(response.user);
                window.plugins.OneSignal.syncHashedEmail(response.user.email);
            }else{
                swal("","Server Authorization Error occurred. Please try again in some time.","error");
                navigator.app.exitApp();
            }
            navigator.splashscreen.hide();
        },
        error:function(error){
            swal(JSON.stringify(error));
            //navigator.splashscreen.hide();
            swal("error","Server Authorization Error occurred. Please try again in some time.","error");
            navigator.app.exitApp();
        }
    });
}

function initializeUser(user){
    if(user.hasOwnProperty('photoUrl')){
        $('.profile-picture').attr('src',user.photoUrl).attr('alt',defaultPhotoUrl);
    }else{
        $('.profile-picture').attr('src',defaultPhotoUrl);
    }
    $(".user-display-name").html(user.displayName);
    $(".user-email").html(user.email);
    $('.active-subscriptions-count').html(user['subscriptions_count']);
    apptoken = user.apptoken;
    userObject = user;
    storage.setItem('userObject',JSON.stringify(user));
    storage.setItem('apptoken',user.apptoken);
    $.mobile.changePage("#homepage");
    try{
        window.plugins.OneSignal.getIds(function(ids) {
            registerDeviceToUser(ids.userId);
        });
    }catch(err){
        swal("Error occurred",err.message,"error");
    }
    isLoggedIn = true;
}

function registerDeviceToUser(deviceId) {
    $.ajax({
        url:serverBaseURL+appRoutes['register-onesignal-id'],
        data:{apptoken:apptoken,device_id:deviceId},
        method:"POST",
        success:function(response) {
            /*if(response.success){
                swal("Device registered for notifications");
            }else{
                swal("Failed to register device for notifications");
            }*/
        },
        error:function(){
            /*swal("Failed to register device for notifications");*/
        }
    });
}
function signUpFunction(){
    $('.error-message-div').hide();
    signUpForm.parsley().validate();
    if(signUpForm.parsley().isValid()){
        $.ajax({
            url:serverBaseURL+appRoutes.signup,
            method:"POST",
            data:signUpForm.serialize(),
            success:function(response){
                if(response.success){
                    serverAuth(response.user);
                    signUpForm.trigger('reset');
                }else{
                    if(response.hasOwnProperty('message')){
                        $('.error-message-text').html(response.message);
                        $('.error-message-div').fadeIn();
                    }else{
                        $('.error-message-text').html("Some error occurred. Please try again later!");
                        $('.error-message-div').fadeIn();
                    }
                }
            },
            error:function(error){
                $('.error-message-text').html("Some error occurred. Please try again later!");
                $('.error-message-div').fadeIn();
            }
        });
    }
}
function signInFunction(){
    $('.error-message-div').hide();
    signInForm.parsley().validate();
    if(signInForm.parsley().isValid()){
        swal(signInForm.serialize());
        $.ajax({
            url:serverBaseURL+appRoutes.login,
            method:"POST",
            data:signInForm.serialize(),
            success:function(response){
                if(response.status == 'success'){
                    initializeUser(response.user);
                    signInForm.trigger('reset');
                }else{
                    if(response.hasOwnProperty('message')){
                        $('.error-message-text').html(response.message);
                        $('.error-message-div').fadeIn();
                    }else{
                        $('.error-message-text').html("Some error occurred. Please try again later!");
                        $('.error-message-div').fadeIn();
                    }
                }
            },
            error:function(error){
                $('.error-message-text').html("Some error occurred. Please try again later!");
                $('.error-message-div').fadeIn();
            }
        });
    }
}
function loadProfileDetails(){
    $("#change-password").hide();
    $('#set-password').hide();
    updatePasswordSection.hide();
    updateProfileSection.show();
    $.ajax({
        url:serverBaseURL+appRoutes['profile'],
        method:"POST",
        data:{"apptoken" : apptoken},
        success:function(response){
            if(response.success){
                var user = response.data;
                $('#user-name').val(user.name);
                $('#user-email').val(user.email);
                $('#user-phone').val(user.phone);
                photo = user.photo;
                if(user.photo == null){ photo = defaultPhotoUrl; }
                $('#profile-image-url').val(photo);
                $('.profile-picture').attr('src',photo);
                if(user.password){
                    $("#change-password").show()
                }else{
                    $("#set-password").show()
                }
            }else{
                var message = "Some error occured while fetching profile details. Please try again later!";
                if(response.hasOwnProperty('message')){ message = response.message; }
                swal("",message,"error");
                backTo('#homepage');
            }
        },
        error:function(){
            swal("","Some error occurred while fetching profile details. Please try again later!","error");
            backTo('#homepage');
        }
    });
}
function logout(){
    storage.removeItem('userObject');
    storage.removeItem('apptoken');
    isLoggedIn = false;
    backTo("#welcome");
}
function profileChangeFunction(){
    updateProfileForm.parsley().validate();
    if(updateProfileForm.parsley().isValid()){
        $.ajax({
            url:serverBaseURL+appRoutes['update-profile'],
            method:"POST",
            data:updateProfileForm.serialize()+'&apptoken='+apptoken,
            success:function (response) {
                if(response.success){
                    swal('Profile updated successfully!');
                    backTo("#homepage");
                    var userUpdatedObject = JSON.parse(storage.getItem('userObject'));
                    userUpdatedObject.photoUrl = $('#profile-image-url').val();
                    userUpdatedObject.displayName = $('#user-name').val();
                    userUpdatedObject.email = $("#user-email").val();
                    initializeUser(userUpdatedObject);
                }else{
                    var message = "Some error occurred while saving profile details. Please try again later!";
                    if(response.hasOwnProperty('message')){ message = response.message; }
                    swal("",message,"error");
                }
            },
            error:function(){
                var message = "Some error occurred while saving profile details. Please try again later!";
                swal("",message,"error");
            }
        });
    }
}
function passwordChangeFunction(){
    passwordChangeForm.parsley().validate();
    if(passwordChangeForm.parsley().isValid()){
        $.ajax({
            url:serverBaseURL+appRoutes['password-reset'],
            method:"POST",
            data:passwordChangeForm.serialize()+"&apptoken="+apptoken,
            success:function(response){
                if(response.success){
                    swal("",'Password updated successfully!',"success");
                    passwordChangeForm.trigger('reset');
                }else{
                    var message = "Some error occurred while updating password. Please try again later.";
                    if(response.hasOwnProperty('message')){ message = response.message; }
                    swal("",message,"error");
                }
            },
            error:function(){
                var message = "Some error occurred while updating password. Please try again later.";
                swal("",message,"error");
            }
        })
    }
}
function passwordSetFunction(){
    passwordSetForm.parsley().validate();
    passwordSetForm.parsley().validate();
    if(passwordSetForm.parsley().isValid()){
        $.ajax({
            url:serverBaseURL+appRoutes['password-set'],
            method:"POST",
            data:passwordSetForm.serialize()+"&apptoken="+apptoken,
            success:function(response){
                if(response.success){
                    swal('Password Set successfully!');
                    passwordSetForm.trigger('reset');
                }else{
                    var message = "Some error occurred while setting password. Please try again later.";
                    if(response.hasOwnProperty('message')){ message = response.message; }
                    swal("",message,"error");
                }
            },
            error:function(){
                var message = "Some error occurred while setting password. Please try again later.";
                swal("",message,"error");
            }
        })
    }
}
function changeProfilePicture(){
    $("#patient_pic").trigger('click');
}
function goBack(){
    var nav = window.navigator;
    // if the setting is on and the navigator object is
    // available use the phonegap navigation capability
    if( this.phonegapNavigationEnabled &&
        nav &&
        nav.app &&
        nav.app.backHistory ){
        nav.app.backHistory();
    } else {
        window.history.back();
    }
}