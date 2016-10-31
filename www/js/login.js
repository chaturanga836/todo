(function(window){

	var app= angular.module('starter');

	app.controller('LoginController',[
		'$scope',
		'$http',
		'$state',
		'$ionicHistory',
		'$auth',
		'$ionicLoading',
		'dataTransferService',
		'$ionicModal',
		function($scope,$http,$state,$ionicHistory,$auth,$ionicLoading,dataTransferService,$ionicModal){


		$scope.credentials={
			username:'',
			password:''
		}

		$ionicModal.fromTemplateUrl('templates/models/loginpopup.html',{
		scope: $scope,
		animation: 'slide-in-up',
		}).then(function(modal) {
		 $scope.loginpopup= modal;
		});

		$scope.login=function(){
			if($scope.credentials.username.trim()=="" || $scope.credentials.password.trim()==""){

				return;
			}

			var credentials = {
		 	username: $scope.credentials.username,
		 	password: $scope.credentials.password
 		}

		$ionicLoading.show();

			$auth.login(credentials).then(function(data) {
				$ionicLoading.hide();
				dataTransferService.setData('auth',{
					username:$scope.credentials.username,
					password:$scope.credentials.password
				});

				if(data.data.succsess){
					dataTransferService.setData('auth',{
						username:$scope.credentials.username,
						password:$scope.credentials.password,
						id:data.data.auth
					});
					$state.go('customers');
				}else{
						$ionicLoading.hide();
					  $scope.itmepopup.show();

				}


			},function(ERR){
				$ionicLoading.hide();
			})
		}
	}])


})(window);
