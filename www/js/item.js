(function(window){
	var app= angular.module('starter');

  app.controller('ItemsController',
	[
		'$scope',
		'$http',
		'$state',
		'$ionicHistory',
		'dataTransferService',
		'$ionicPopup',
		'ajaxService',
		'$ionicModal',
		'$stateParams',
		'$ionicScrollDelegate',
    function(
			$scope,
			$http,
			$state,
			$ionicHistory,
			dataTransferService,
			$ionicPopup,
			ajaxService,
			$ionicModal,
			$stateParams,
			$ionicScrollDelegate){


       $scope.items=[];
			 var page=1;
			 var prev=0,curr=0;
			 $scope.cart=[];
			 $scope.totalPrice=0;
			 $scope.selectedItme=null;
			 //$scope.onloading=false;
			 $scope.search={
				 onloading:false,
				 keyword:'',
				 show:false,
			 }

			$scope.customer=dataTransferService.customer;
			$scope.cart=dataTransferService.cart;
			$scope.totalPrice=dataTransferService.totalPrice;

			$scope.$watch(
				function(){
					return dataTransferService.totalPrice;
				},
				function(newvla,oldval){
					$scope.totalPrice=dataTransferService.totalPrice;
				},true
			);

			var awtItem=function(){
				if($scope.search.onloading){
					return;
				}
				$scope.search.onloading=true;
				ajaxService.get('get-all-items/'+page,
					 function(response){
							$scope.search.onloading=false;
						 for(var i in response.data.items){
							 dataTransferService.availableItems.push(response.data.items[i])
							 $scope.items.push(response.data.items[i]);
						 }
						 if(response.data.items.length>0){

							 page+=1;
						 }
					 },
					 function(response){ $scope.search.onloading=false;}
				 );
			}
			awtItem();
			var r=$ionicScrollDelegate.getScrollView();


			$scope.getScrolPosition=function(){
				prev=curr;
				curr=$ionicScrollDelegate.getScrollPosition().top;

				if((curr-10)>=$ionicScrollDelegate.getScrollView().__maxScrollTop){
					if(curr>prev){
						
							awtItem();
					}

				}

			}

			$scope.$watch(
				function(){ return dataTransferService.cart},
				function(newVal,oldVal){
					$scope.cart=dataTransferService.cart;
				},true
			)


			 if($scope.cart==null || $scope.cart.length<1){
				 $scope.cart=[];
				 dataTransferService.totalPrice=0;
			 }else{
				 for(var i in $scope.items){
					 dataTransferService.totalPrice+=($scope.items[i].wsale*$scope.items[i].amount);
				 }
			 }








			 $scope.showerror={
				 show:false,
				 message:''
			 }

			 $scope.showSearch=function(obj){
				 $scope.search.show=obj;
			 }

      var ids=[]
       $scope.addToCart=function(obj){
				  $scope.showerror.show=false;
					$scope.showerror.message='';
				 	var flag=false;
				 if(obj.amount==undefined || obj.amount<1){
					 $scope.showerror.show=true;
					 $scope.showerror.message="Empty order!"
					  return;
				 }


				for(var j in dataTransferService.cart){
					if(dataTransferService.cart[j].id==obj.id){
						dataTransferService.cart[j]=obj;
						flag=true;
						break;
					}
				}
				if(!flag){

					$scope.cart.push(obj);
				}

         //dataTransferService.setData('cart',$scope.cart);
				 dataTransferService.totalPrice+=(obj.wsale*obj.amount);
				 $scope.itmepopup.hide();
				 $scope.selectedItme=null;
       }

			 $scope.cancel=function(){
				 $scope.selectedItem=null;
				 $scope.itmepopup.hide();
			 }

			 $scope.selectItem=function(itme){

				 $scope.selectedItem=itme
				  $scope.itmepopup.show();

			 }

			 $ionicModal.fromTemplateUrl('templates/models/itemqty.html',{
				 scope: $scope,
				 animation: 'slide-in-up',
			 }).then(function(modal) {
    			$scope.itmepopup= modal;
  			});

			 $scope.goBack=function(){$ionicHistory.goBack();}

       $scope.searchItems=function(){
				 if($scope.search.keyword==''|| $scope.search.keyword==null){
					 $scope.items=dataTransferService.availableItems;
					 return;
				 }
				 $scope.onloading=true;
         ajaxService.get('search-items/'+$scope.search.keyword,
         function(response){
					 $scope.onloading=false;
           if(response.data.items.length>0){
             $scope.items=[];
             $scope.items=response.data.items;
           }
         },
         function(response){
					 $scope.onloading=false;
         }
       );
       }

       $scope.toCart=function(){




         if($scope.cart.length<1){
           var alertPopup=$ionicPopup.show({
             title: 'Empty Order!',
             template: 'No in the order items!',
             buttons: [{ text: 'OK',type: 'button-positive', }]
           });
           return;
         }
         $state.go('cart');
       }

      $scope.clearCart=function(){
				dataTransferService.cart=[];
				dataTransferService.totalPrice=0;
         //dataTransferService.setData('cart',[]);
         ids=[];
      }

    }])
  })(window);
