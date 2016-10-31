// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','satellizer'])

.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    //checkin internet connection
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    }).then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
      }

    }
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant('ApiEndpoint', {
  url: 'http://test.senitlo.com/api/'
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider,$authProvider) {

  $authProvider.loginUrl = 'http://test.senitlo.com/api/login';

  $urlRouterProvider.otherwise('/auth');
        $stateProvider
        .state('login', {
                url: '/',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .state('customers', {
                url: '/customers',
                templateUrl: 'templates/customers.html',
                controller: 'CustomerController'
            })
            .state('items', {
                url: "/items",
                templateUrl: "templates/items.html",
                controller: "ItemsController"
            })
            .state('cart', {
                url: "/cart",
                templateUrl: "templates/cart.html",
                controller: "CartController"
            });
        $urlRouterProvider.otherwise('/');
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        delete $httpProvider.defaults.headers.common['Access-Control-Request-Headers'];
        delete $httpProvider.defaults.headers.common['origin'];
    })

.service('dataTransferService',function(){

 this.dataSet={};
 this.setData=function(objectname,data){
   this.dataSet[objectname]=data;
 }

 this.getData=function(objectname,isclear){

   if(isclear==undefined ||isclear==null){
     isclear=false;
   }

   isclear=Boolean(isclear);

   var self=this.dataSet
   if(this.dataSet.hasOwnProperty(objectname)){
     return this.dataSet[objectname];
   }

   return null;
 }

})
.service('ajaxService',function($http,ApiEndpoint,$ionicPopup){


  this.post=function(url,data,success,error){
    try{

        // var invocation = new XMLHttpRequest();
        // invocation.open('POST', ApiEndpoint.url+url, true);
        // invocation.onreadystatechange = handler;
        // invocation.send();
      $http({
        method: 'POST',
        url:ApiEndpoint.url+url,
        withCredentials:false,
        headers:{
          'Access-Control-Allow-Methods':'POST, GET, OPTION,PUT,DELETE',
          'Access-Control-Allow-Origin': '*',
        },
        data:data
      }).then(
        function(response){
          success(response);
        },function(response){
          error(response);
        }

      )
    }catch(error){

    }
  }

  this.get=function(url,success,err){

    try{

      $http.jsonp(ApiEndpoint.url+url+'?callback=JSON_CALLBACK')
      .then(
        function(response){ success(response); },
        function(response){
           if(response.state==404){
              $ionicPopup.confirm({
                        title: "connection interupped",
                        content: "server connection has interuption."
                    }).then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
           }
          (response)
        })

    }catch(error){
      console.log(error)
    }
  }

})
