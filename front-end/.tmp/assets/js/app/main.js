(function() {
	$(".button-collapse").sideNav();
    var gigs = [];
	var singleGig = {};
	var href;
    var app = angular.module('sidegig', ['ngRoute', 'angular-loading-bar', 'ngCookies' ]);
//	var api_url = "https://peaceful-coast-76647.herokuapp.com/";
	var api_url = "http://127.0.0.1:4000/";
	
	app.config(['$routeProvider', '$httpProvider', '$httpProvider', function($routeProvider, $httpProvider, cfpLoadingBarProvider) {
		
		$routeProvider
		
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeController'
		})
		
		.when('/create-gig', {
			templateUrl: 'pages/create-gig.html',
			controller: 'createController'
		})
		
		.when('/gigs/:id', {
			templateUrl: 'pages/single-gig.html',
			controller: 'singleGigController'
		})
		
		.when('/gigs/category/:category_name', {
			templateUrl: 'pages/home.html',
			controller: 'categoriesController'
		})
		
		.when('/login', {
			templateUrl: 'pages/login.html',
			controller: 'loginPageController'
		})
		
		.when('/register', {
			templateUrl: 'pages/register.html',
			controller: 'registerController'
		})
		
		.when('/logout', {
			controller: 'logoutController',
			templateUrl: 'pages/home.html'
		})
		
		$httpProvider.defaults.withCredentials = true;
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.parentSelector = '#gig-list';
    	cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading Gigs...</div>';
	}]);
	
	app.factory('Auth', ['$http', '$rootScope', '$cookies', '$location', function($http, $rootScope, $cookies, $location) {
		
		return {
			logout: function() {
				
				console.log("Auth.logout");
				$http({
					method: 'GET',
					url: api_url+'logout',
					dataType: 'json'
				}).success(function(data) {
					console.log("logged out");
					$rootScope.user = null;
					$location.path('/login');
				})
			},
			authenticate: function() {
				$http({
					method: 'GET',
					url: api_url+'authenticate',
					dataType: 'json'
				}).success(function(data) {
					console.log('authenticate data:', data);
					$rootScope.user = data;
				})
			}
		}
	}]);
	
	app.run( function($rootScope, $location, Auth) {
		
		$rootScope.logout = Auth.logout;
		
		$rootScope.$watch(function() {
			return $location.path();
		}, 
		function(a) {
			console.log('url has changed: ' + a);
			Auth.authenticate();
		});
	})
	
	app.controller('ApplicationController', ['Auth', '$rootScope', function($rootScope, $http, Auth) {
		
	}]);

	
    app.controller('homeController', [ 
		'$scope',
		'$http',
		function($scope, $http) {
			
			$http({
				method: 'GET',
				url: api_url+'gigs/',
				dataType: 'json'
			}).success(function(data) {
				$scope.gigs = data;
			})
		}
	]);
	
	app.controller('singleGigController', [
		'$scope', 
		'$http',
		'$routeParams',
		function($scope, $http, $routeParams) {
			$scope.gig = {};
			
			$http({
				method: 'GET',
				url: api_url+'gigs/'+$routeParams.id,
				dataType: 'json'
			}).success(function(data) {
				$scope.gig = data;
			})
		}
	]);
	
	app.controller('categoriesController', [
		'$scope',
		'$http',
		'$routeParams',
		function($scope, $http, $routeParams) {
			$scope.gigs = [];
			
			$http({
				method: 'GET',
				url: api_url+'gigs/category/'+$routeParams.category_name,
				dataType: 'json'
			}).success(function(data) {
				$scope.gigs = data;
			})
		}
	]);
	
	app.controller('loginPageController', [
		'$scope',
		'$http',
		'$location',
		'Auth',
		function($scope, $http, $location, Auth) {
			$scope.login = function(credentials) {
				$http({
					method: 'post',
					url: api_url+'users/login',
					data: {
						username: credentials.username,
						password: credentials.password
					},
					dataType: 'json'
				}).success(function(data) {
					console.log(data);
					$location.path('/');
				})
			}
		}
	]);
	
	app.controller('createController', [
		'$scope',
		'$http',
		'$location',
		function($scope, $http, $location) {
			
			$('.submit-gig').on('submit', function(e) {
				e.preventDefault();
				$http({
					method: 'post',
					url: api_url+'gigs',
					data: {
						title: $('.submit-gig input[name="title"]').val(),
						description: $('.submit-gig textarea').val(),
						category: $('.submit-gig select').val()
					}, 
					dataType: 'json'
				}).success(function(data) {
					$location.path('/gigs/'+data.id);
				})
			})
		}
	])
	
})();