'use strict';

(function () {
    var app = angular.module("myApp");

    var SettingsCtrl = function ($scope, $http, $location, $route,$timeout)
    {
        console.log("forgotpassword");
        var SettingsInfo = {};
        $scope.settingsDetails = function () {
            SettingsInfo.email = $scope.email;
            $http.post('/settings', SettingsInfo)
                    .success(function (data, status) {
                        console.log(data);
                        $scope.msg = data;
                        $timeout(function () {
                            $route.reload();
                        }, 4000);

                    });
        };
    }
    app.controller('SettingsCtrl', SettingsCtrl);
}());