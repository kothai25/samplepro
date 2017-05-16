'use strict';

(function () {
    var app = angular.module("myApp");

    var AccountCtrl = function ($scope, $http)
    {
        $scope.accountDetails = function () {
            $http.get('/account')

                    .success(function (data, status) {
                        console.log(data);
                        $scope.msg = data;
                    });
        };
    }
    app.controller('AccountCtrl', AccountCtrl);
}());