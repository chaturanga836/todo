(function(window){
	var app= angular.module('starter');

	app.controller('CustomerController',['$scope','$http','$state','$ionicHistory','dataTransferService','ajaxService',
		function($scope,$http,$state,$ionicHistory,dataTransferService,ajaxService){


			$scope.customers=[];
			$scope.search={
				keyword:"",
			onloading:false
			};

			$scope.auth=dataTransferService.getData('auth');

			var d=dataTransferService.customer;


			$scope.loadCustomers=function(){
					if($scope.search.keyword=="" ||$scope.search.keyword==null){
						return;
					}
					$scope.search.onloading=true;
					ajaxService.get('search-customer/'+$scope.search.keyword,
					function(response){
						$scope.search.onloading=false;
						if(response.data.customers.length>0){
							$scope.customers=[];
							for(var i in response.data.customers){
								$scope.customers.push(response.data.customers[i]);
							}
						}

					},function(resp){
						$scope.search.onloading=false;
					})
			}

			$scope.viewReport=function(){
					$state.go('report');
			}

			$scope.selectcustomer=function(obj){

					dataTransferService.customer=obj;

					$state.go('items');
			}

		}]);



})(window);
