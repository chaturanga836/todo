(function(window){
	var app= angular.module('starter');

	app.controller('CustomerController',['$scope','$http','$state','$ionicHistory','dataTransferService','ajaxService',
		function($scope,$http,$state,$ionicHistory,dataTransferService,ajaxService){


			$scope.customers=[];
			$scope.keyword="";
			$scope.onloading=false;
			$scope.auth=dataTransferService.getData('auth');

			var d=dataTransferService.getData('customer');


			$scope.loadCustomers=function(){
					if($scope.keyword=="" ||$scope.keyword==null){
						return;
					}
					$scope.onloading=true;
					ajaxService.get('search-customer/'+$scope.keyword,
					function(response){
						$scope.onloading=false;
						if(response.data.customers.length>0){
							$scope.customers=[];
							for(var i in response.data.customers){
								$scope.customers.push(response.data.customers[i]);
							}
						}

					},function(resp){
						$scope.onloading=false;
					})
			}

			$scope.selectcustomer=function(obj){

					dataTransferService.setData('customer',obj);

					$state.go('items');
			}

		}]);

})(window);
