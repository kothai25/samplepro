'use strict';

(function () {
    var app = angular.module("myApp");

    var LoginCtrl = function ($scope, $http, $location)
    {
        var loginInfo = {};

        $scope.loginDetails = function () {

            loginInfo.email = $scope.email;
            loginInfo.password = $scope.password;

            $http.post('/loginverification', loginInfo)

                    .success(function (data, status) {

                        if (data == "Successfully logged in") {
                            console.log(data);
                            $scope.msg = data;
                            $location.path('/account');
                        } else
                        {
                            console.log(data);
                            $scope.msg = data;
                        }
                    });
        };
    }
    app.controller('LoginCtrl', LoginCtrl);
}());