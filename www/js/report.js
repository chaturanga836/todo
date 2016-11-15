(function(window){
	var app= angular.module('starter');

		// app.controller('ReportController',
		// ['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal','$stateParams',
    // function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal,$stateParams){
		//
		// }]);

    app.controller('todayReportController',
    ['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal','$stateParams',
    function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal,$stateParams){

			$scope.history=[];
			$scope.summary={
				totalproducts:0,
				totalsale:0,
				totalcustomers:0
			}

        $scope.auth=dataTransferService.getData('auth');

        ajaxService.get('today-report/'+$scope.auth.id,
        function(response){

					if(response.data.succsess){

						$scope.history=response.data.history;
						$scope.summary.totalproducts=response.data.totalProducts;
						$scope.summary.totalsale=response.data.totalprice;
						$scope.summary.totalcustomers=response.data.totalcustomers;
					}
				},
        function(response){

				});





    }]);

		app.controller('monthlyReportController',
		['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal','$stateParams',
    function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal,$stateParams){

			$scope.auth=dataTransferService.getData('auth');
			$scope.history=[];
			$scope.summary={
				totalproducts:0,
				totalsale:0,
				totalcustomers:0
			}
			
			ajaxService.get('month-report/'+$scope.auth.id,

			function(response){

				if(response.data.succsess){

					$scope.history=response.data.history;
					$scope.summary.totalproducts=response.data.totalProducts;
					$scope.summary.totalsale=response.data.totalprice;
					$scope.summary.totalcustomers=response.data.totalcustomers;
				}

			},
			function(response){

			});
		}]);
})(window);
