(function(window){
	var app= angular.module('starter');

	app.controller('CustomerController',['$scope','$http','$state','$ionicHistory','dataTransferService','ajaxService',
		function($scope,$http,$state,$ionicHistory,dataTransferService,ajaxService){


			$scope.customers=[];
			$scope.keyword="";
		
			var customerdata=[
			  {id:1,first_name:'Pandula',last_name:'Basnayaka'},
			  {id:2,first_name:'Buddhika',last_name:'Chathuranga'},
			  {id:3,first_name:'Shanu',last_name:'Balasooriya'},
			  {id:4,first_name:'Pasindu',last_name:'Priyantha'},
			  {id:5,first_name:'Gimhan',last_name:'Jayasinghe'}

			];

			$scope.loadCustomers=function(){
				//console.log("hhh")
					if($scope.keyword=="" ||$scope.keyword==null){
						return;
					}
					ajaxService.get('search-customer/'+$scope.keyword,
					function(response){

						if(response.data.customers.length>0){
							$scope.customers=[];
							for(var i in response.data.customers){
								$scope.customers.push(response.data.customers[i]);
							}
						}

					},function(resp){

					})
				var patt = new RegExp("\\b"+$scope.keyword,"ig")
				if($scope.keyword.length<1){
					return;
				}
					$scope.customers=[];
				for(var i in customerdata){
					var fullName=customerdata[i].first_name+' '+customerdata[i].last_name;
					if(patt.test(fullName)){
						$scope.customers.push(customerdata[i]);
					}
				}
			}

			$scope.selectcustomer=function(obj){

					dataTransferService.setData('customer',obj);

					$state.go('items');
			}

		}]);

})(window);
