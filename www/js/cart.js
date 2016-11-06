(function(window){
	var app= angular.module('starter');

  app.controller('CartController',[
		'$scope',
		'$http',
		'$state',
		'ajaxService',
		'$ionicHistory',
		'dataTransferService',
		'$ionicPopup',
		'$ionicModal',
		'$ionicLoading',
    function($scope,$http,$state,ajaxService,$ionicHistory,dataTransferService,$ionicPopup,$ionicModal,$ionicLoading){
      $scope.cart=[];
      $scope.customer=dataTransferService.customer;
			$scope.auth=dataTransferService.getData('auth');
			$scope.cart=dataTransferService.cart;
			$scope.selectedItem=null;

			$ionicModal.fromTemplateUrl('templates/models/orderSuccess.html',{
				scope: $scope,
				animation:'slide-in-up',
			}).then(function(modal){
				 $scope.orderSuccess= modal;
			 });

			//  $ionicModal.fromTemplateUrl('templates/models/edititem.html',{
			// 	scope:$scope,
			// 	animation:'slide-in-up',
			//  }).then(function(modal){
			// 	 $scope.cartpopup= modal;
			//  });

			if($scope.cart==null || $scope.cart.length<1){
				$scope.cart=[];
				$scope.totalPrice=0;
			}else{
				for(var i in $scope.cart){
					dataTransferService.totalPrice+=($scope.cart[i].wsale*$scope.cart[i].amount);
				}
			}

			$scope.showerror={
 				 show:false,
 				 message:''
 			 }

			 $scope.mainerr={
				 show:false,
				 message:''
			 }



				$scope.goBack=function(){
					$ionicHistory.goBack();
				}

				$scope.saveToCart=function(obj){
					if(obj.amount==undefined || obj.amount<1){
 					 		$scope.showerror.show=true;
 					 		$scope.showerror.message="Empty order!"
 					  	return;
 				 	}
					dataTransferService.totalPrice=0;
					for(var j in dataTransferService.cart){
						if(dataTransferService.cart[j].id==obj.id){
							dataTransferService.cart[j]=obj;

						}
						dataTransferService.totalPrice+=(dataTransferService.cart[j].wsale*dataTransferService.cart[j].amount);
					}
					//dataTransferService.totalPrice=$scope.totalPrice;

					$scope.orderSuccess.hide();
 				  $scope.selectedItem=null;
				}

				$scope.$watch(
					function(){
						return dataTransferService.totalPrice;
					},
					function(newvla,oldval){
						$scope.totalPrice=dataTransferService.totalPrice;
					},true
				);

				$scope.$watch(
					function(){ return dataTransferService.cart},
					function(newVal,oldVal){
						$scope.cart=dataTransferService.cart;
					},true
				);

				$scope.removeFromCart=function(obj){
					for(var j in dataTransferService.cart){
						if(dataTransferService.cart[j].id==obj.id){
							dataTransferService.totalPrice-=obj.wsale*obj.amount;
							dataTransferService.cart.splice(j,1);

							if(dataTransferService.cart.length<1){
								dataTransferService.totalPrice=0;
								$ionicHistory.clearCache();
								$state.go('items');
							}
							break;
						}
					}
				}

				// $scope.gotomain=function(){
				//
				// 	 dataTransferService.cart=[];
				// 	 dataTransferService.customer=null;
				// 	 dataTransferService.totalPrice=0;
				// 	 $ionicHistory.clearCache();
				// 	$state.go('customers');
				// }



				$scope.placeOrder=function(){

					if($scope.cart.length<1){
						$scope.mainerr.show=true;
						$scope.mainerr.message='Cart is empty';

						$ionicPopup.show({
							title: 'Empty Order!',
							template: '<p class="ion-error-msg">order should have atleast one item !</p>',
							buttons: [{
								text: 'Back',
								type:'button-positive',
								onTap: function(e) {
										 dataTransferService.cart=[];
										 dataTransferService.customer=null;
										 dataTransferService.totalPrice=0;
										 $ionicHistory.clearCache();
										$state.go('customers');
								}
							 }]
						});

						return;
					}
					$ionicLoading.show();
					ajaxService.post('place-order',{
						'customerid':parseInt(dataTransferService.customer.CustomerID),
						'userid':$scope.auth.id,
						'cart':dataTransferService.cart
					},function(response){
							dataTransferService.cart=[];
							dataTransferService.totalPrice=0;

						  dataTransferService.customer=null;
							$ionicLoading.hide();
						 if(response.data.succsess){
							 $ionicPopup.show({
	 							title: 'Order Success !',
	 							template: '<p class="ion-error-msg">Success</p>',
	 							buttons: [{
	 								text: 'Go To main',
	 								type:'button-positive',
	 								onTap: function(e) {

	 									$state.go('customers');
	 								}
	 							 }]
	 						});
							 //$scope.orderSuccess.show();
							 	//dataTransferService.cart=[];


						 }else{
							 $ionicPopup.show({
								 title: 'Internal Server Issue!',
								 template:'<p class="ion-error-msg">Check your Interet connection !</p><p>or</p><p>Contact System Admin</P>',
								 buttons: [{
									 text: 'Back',
									 type:'button-positive',
									 onTap: function(e) {
										 $state.go('items');
									 }
									}]
							 });
						 }

					},function(err){
							$ionicLoading.hide();
							$ionicPopup.show({
								title: 'Internal Server Issue!',
								template:'<p class="ion-error-msg">Check your Interet connection !</p><p>or</p><p>Contact System Admin</P>',
								buttons: [{
									text: 'Back',
									type:'button-positive',
									onTap: function(e) {
										$state.go('customers');
									}
								 }]
							});
					})

				}

				$scope.cancelEdit=function(){
					$scope.selectedItem=null;
					 $scope.orderSuccess.hide();
					//$scope.cartpopup.hide();
				}

        $scope.editItem=function(item){
						$scope.selectedItem=item;
						$scope.orderSuccess.show();
        }

				$scope.cancelOrder=function(){
					dataTransferService.cart=[];
					dataTransferService.totalPrice=0;
					$ionicHistory.clearCache();
					$state.go('items');
				}



    }])
  })(window);
