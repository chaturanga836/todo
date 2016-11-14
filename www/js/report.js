(function(window){
	var app= angular.module('starter');

    app.controller('ReportController',
    ['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal','$stateParams',
    function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal,$stateParams){

				$todayReport=null;
				$monthReport=null;

        $scope.auth=dataTransferService.getData('auth');

        ajaxService.get('today-report'+$scope.auth.id,
        function(response){
					if(response.data.success){

					}
				},
        function(response){

				});

				ajaxService.get('month-report'+$scope.auth.id,
        function(response){
					if(response.data.success){

					}
				},
        function(response){

				});



    }]);
})(window);
