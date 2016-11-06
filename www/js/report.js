(function(window){
	var app= angular.module('starter');

    app.controller('ReportController',
    ['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal','$stateParams',
    function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal,$stateParams){
        $scope.auth=dataTransferService.getData('auth');
        ajaxService.get('today-report'+$scope.auth.id,
        function(response){},
        function(response){});

    }]);
})(window);
