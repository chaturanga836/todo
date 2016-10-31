(function(window){
	var app= angular.module('starter');

  app.controller('ItemsController',
	['$scope','$http','$state','$ionicHistory','dataTransferService','$ionicPopup','ajaxService','$ionicModal',
    function($scope,$http,$state,$ionicHistory,dataTransferService,$ionicPopup,ajaxService,$ionicModal){
       $scope.customer=dataTransferService.getData('customer');

       $scope.items=[];
			 $scope.selectedItme=null;
			 $scope.search={
				 keyword:'',
				 show:false
			 }

			 $scope.showerror={
				 show:false,
				 message:''
			 }

			 $scope.showSearch=function(obj){
				 $scope.search.show=obj;
			 }
      $scope.cart=[];
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


				for(var j in $scope.cart){
					if($scope.cart[j].id==obj.id){
						$scope.cart[j]=obj;
						flag=true;
						break;
					}
				}
				if(!flag){

					$scope.cart.push(obj);
				}

         dataTransferService.setData('cart',$scope.cart);
         for(var i in $scope.items){
           if($scope.items[i].id==obj.id){
             $scope.items.splice(i,1);
           }
         }

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
					 return;
				 }
         ajaxService.get('search-items/'+$scope.search.keyword,
         function(response){
           if(response.data.items.length>0){
             $scope.items=[];
             $scope.items=response.data.items;
           }
         },
         function(response){

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
         dataTransferService.setData('cart',[]);
         ids=[];
      }

    }])
  })(window);