'use strict';

(function () {
    var app = angular.module("myApp");

    var RegisterCtrl = function ($scope, $http, $location, $route, $timeout)
    {
        var RegisterInfo = {};

        $scope.registerDetails = function () {

            RegisterInfo.title = $scope.title;
            RegisterInfo.firstname = $scope.firstname;
            RegisterInfo.lastname = $scope.lastname;
            RegisterInfo.dob = $scope.dob;
            RegisterInfo.email = $scope.email;
            RegisterInfo.password = $scope.password;
            if ($scope.password != $scope.conformpassword) {
                $scope.IsMatch = true;
                return false;
            }
            $scope.IsMatch = false;
            console.log(RegisterInfo);
            $http.post('/register', RegisterInfo)
                    .success(function (data, status) {
                        console.log('Data posted successfully');
                        $scope.msg = data;
                        $timeout(function () {
                            $route.reload();
                        }, 4000);
                    });
        };
    }
    app.controller('RegisterCtrl', RegisterCtrl);
}());