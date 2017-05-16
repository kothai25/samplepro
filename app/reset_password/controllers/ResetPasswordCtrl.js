'use strict';

(function () {
    var app = angular.module("myApp");

    var ResetPasswordCtrl = function ($scope, $http, $location)
    {
        var ResetInfo = {};

        $scope.resetpasswordformDetails = function () {
            ResetInfo.password_reset_key = $scope.password_reset_key;
            ResetInfo.password = $scope.password;
            
            if ($scope.password != $scope.conformpassword) {
                $scope.IsMatch = true;
                return false;
            }
            $scope.IsMatch = false;
            
            $http.post('/resetpassword', ResetInfo)

                    .success(function (data, status) {
                        console.log(data);
                        console.log('Data posted successfully');
                        $scope.msg = data;  
                    });
        };
    }
    app.controller('ResetPasswordCtrl', ResetPasswordCtrl);
}());