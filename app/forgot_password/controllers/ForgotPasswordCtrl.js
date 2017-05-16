'use strict';

(function () {
    var app = angular.module("myApp");

    var ForgotPasswordCtrl = function ($scope, $http, $location, $route,$timeout)
    {
        console.log("forgotpassword");
        var ForgotPasswordInfo = {};
        $scope.forgotpasswordDetails = function () {
            ForgotPasswordInfo.email = $scope.email;
            $http.post('/forgotpassword', ForgotPasswordInfo)
                    .success(function (data, status) {
                        console.log(data);
                        $scope.msg = data;
                        $timeout(function () {
                            $route.reload();
                        }, 4000);

                    });
        };
    }
    app.controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
}());