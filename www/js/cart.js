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
      $scope.customer=dataTransferService.getData('customer');
			$scope.auth=dataTransferService.getData('auth');
      $scope.$on('$ionicView.beforeEnter', function() {
					$scope.cart=dataTransferService.getData('cart');
					$scope.customer=dataTransferService.getData('customer');
            if($scope.cart==undefined || $scope.cart==null || typeof $scope.cart!=='object'  ||$scope.cart.length<1){
              $ionicPopup.show({
                title: 'Empty Order!',
                template: 'order should have atleast one item !',
                buttons: [{
                  text: 'Back',
                  type:'button-positive',
                  onTap: function(e) {
                    $ionicHistory.goBack();
                  }
                 }]
              })
            }
        });

				$scope.showerror={
 				 show:false,
 				 message:''
 			 }

			 $scope.mainerr={
				 show:false,
				 message:''
			 }

				$ionicModal.fromTemplateUrl('templates/models/edititem.html',{
					scope: $scope,
					animation: 'slide-in-up',
				}).then(function(modal) {
					 $scope.cartpopup= modal;
				 });

				$scope.goBack=function(){$ionicHistory.goBack();}
				$scope.saveToCart=function(obj){
					if(obj.amount==undefined || obj.amount<1){
 					 		$scope.showerror.show=true;
 					 		$scope.showerror.message="Empty order!"
 					  	return;
 				 	}

					for(var j in $scope.cart){
						if($scope.cart[j].id==obj.id){
							$scope.cart[j]=obj;
							break;
						}
					}

					$scope.cartpopup.hide();
 				  $scope.selectedItme=null;
				}

				$scope.removeFromCart=function(obj){
					for(var j in $scope.cart){
						if($scope.cart[j].id==obj.id){
							$scope.cart.splice(j,1);
							if($scope.cart.length<1){
								$state.go('items');
							}
							break;
						}
					}
				}

				$scope.gotomain=function(){
					 $scope.orderSuccess.hide();
					 dataTransferService.setData('cart',[]);
					 dataTransferService.setData('customer',null);

					 $ionicHistory.clearCache();
					$state.go('customers');
				}

				$ionicModal.fromTemplateUrl('templates/models/orderSuccess.html',{
					scope: $scope,
					animation: 'slide-in-up',
				}).then(function(modal) {
					 $scope.orderSuccess= modal;
				 });

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
									$state.go('items');
								}
							 }]
						});

						return;
					}
					$ionicLoading.show();
					ajaxService.post('place-order',{
						'customerid':parseInt($scope.customer.CustomerID),
						'userid':$scope.auth.id,
						'cart':$scope.cart
					},function(response){
							$ionicLoading.hide();
						 if(response.data.succsess){
							 $scope.orderSuccess.show();
							 	$scope.cart=[];
		 						dataTransferService.setData('cart',$scope.cart);
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
					$scope.cartpopup.hide();
				}
        $scope.editItem=function(item){
						$scope.selectedItem=item;
						$scope.cartpopup.show();
        }

				$scope.cancelOrder=function(){
					$scope.cart=[];
					$ionicHistory.clearCache();
					dataTransferService.setData('cart',[]);
					$ionicHistory.goBack();
				}



    }])
  })(window);
