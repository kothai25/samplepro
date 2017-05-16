'use strict';

(function () {
    var app = angular.module("myApp");

    var RecordsCtrl = function ($scope, $http)
    {
        console.log("listrecords");
       // var recordsInfo = {};

        $scope.recordsDetails = function () {


            $http.get('/listrecords')

                    .success(function (data, status) {
                        console.log(data);
                        $scope.msg = data;                       
                    });
        };
    }
    app.controller('RecordsCtrl', RecordsCtrl);
}());