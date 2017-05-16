'use strict';

(function () {
    var app = angular.module("myApp", ['ngRoute']);
    
    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
                /*.when("/", {
                    templateUrl: 'index.html'
                })*/
                .when("/register", {
                    templateUrl: 'app/register/views/register.html',
                    controller: "RegisterCtrl"
                })
                .when("/login", {
                    templateUrl: 'app/login/views/login.html',
                    controller: "LoginCtrl"
                })
                .when("/account", {
                    templateUrl: 'app/account/views/account.html',
                    controller: "AccountCtrl"
                })
                .when("/account/settings", {
                    templateUrl: 'app/account/settings/views/settings.html',
                    controller: "SettingsCtrl"
                })
                .when("/forgotpassword", {
                    templateUrl: 'app/forgot_password/views/forgotpassword.html',
                    controller: "ForgotPasswordCtrl"
                })
                .when("/resetpassword", {
                    templateUrl: 'app/reset_password/views/resetpassword.html',
                    controller: "ResetPasswordCtrl"
                })
                .otherwise({redirectTo: "/"})
       // $locationProvider.html5Mode(true);
    });

}());
