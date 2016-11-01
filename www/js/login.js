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
		'$ionicPopup',
		function($scope,$http,$state,$ionicHistory,$auth,$ionicLoading,dataTransferService,$ionicModal,$ionicPopup){


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
				if(ERR.status=401){
					var errpop=$ionicPopup.show({
						title: 'Invalid Credential !',
						template: '<p class="dark">invalid username or password !</p>',
						buttons: [{
							text: 'ok',
							type:'button-positive',
							onTap: function(e) {
								errpop.close();
							}
						 }]
					});
				}else{
					var errpop=$ionicPopup.show({
						title: 'Someting went wrong !',
						template: '<p class="ion-error-msg">Check your internet connection !</p>',
						buttons: [{
							text: 'ok',
							type:'button-positive',
							onTap: function(e) {
								errpop.close();
							}
						 }]
					});
				}


			})
		}
	}])


})(window);
