'use strict';

(function() {
	$(".button-collapse").sideNav();
//	$('select').material_select();
    var gigs = [];
	var singleGig = {};
	var href;
    var app = angular.module('sidegig', ['ngRoute', 'angular-loading-bar', 'ngCookies'], function($provide) {
		
	});
//	var api_url = "https://peaceful-coast-76647.herokuapp.com/";
	var api_url = "http://127.0.0.1:4000/";
	
	app.config(['$routeProvider', '$httpProvider', '$provide', function($routeProvider, $httpProvider, cfpLoadingBarProvider, $provide) {
		
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
		
		.when('/register', {
			controller: 'registerController',
			templateUrl: 'pages/register.html'
		})
		
		$httpProvider.defaults.withCredentials = true;
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.parentSelector = '#gig-list';
    	cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading Gigs...</div>';
	}]);
	
	app.service('Auth', ['$http', '$rootScope', '$cookies', '$location', function($http, $rootScope, $cookies, $location) {
		
		return {
			register: function(credentials) {
				$http({
					method: 'post',
					url: api_url+'users',
					data: {
						username: credentials.username,
						password: credentials.password,
						email: credentials.email,
						firstname: credentials.firstname,
						lastname: credentials.lastname
					},
					dataType: 'json'
				}).then(function(data) {
					console.log(data);
					$location.path('/login');
				}, function(response) {
					alert(response);
				})
			},
			login: function(credentials) {
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
			},
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
	
	app.service('http_service', function($http, $routeParams) {
		this.backendCall = function(params) {
			console.log("backend call");
			return $http({
				method: params.method,
				url: params.url,
				data: params.data || null,
				dataType: 'json'
			})
		}
		
	});
	
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
	
	app.controller('ApplicationController', ['Auth', '$rootScope', function($rootScope, $http, Auth, backend) {
	}]);

	
    app.controller('homeController', [ 
		'$scope',
		'http_service',
		'$http',
		function($scope, http_service, $http) {
			var params = {
				method: 'get',
				url: api_url+'gigs/'
			}
			http_service.backendCall(params).then(function(results) {
				$scope.gigs = results.data;
			});
		}
	]);
	
	app.controller('singleGigController', [
		'$scope',
		'http_service',
		'$http',
		'$routeParams',
		function($scope, http_service, $http, $routeParams) {
			$scope.gig = {};
			var params = {
				method: 'GET',
				url: api_url+'gigs/'+$routeParams.id
			}
			http_service.backendCall(params).then(function(results) {
				$scope.gig = results.data;
			})
		}
	]);
	
	app.controller('categoriesController', [
		'$scope',
		'http_service',
		'$http',
		'$routeParams',
		function($scope, http_service, $http, $routeParams) {
			$scope.gigs = [];
			var params = {
				method: 'GET',
				url: api_url+'gigs/category/'+$routeParams.category_name,
			}
			http_service.backendCall(params).then(function(results) {
				$scope.gigs = results.data;
			});
		}
	]);
	
	app.controller('loginPageController', [
		'$scope',
		'$http',
		'$location',
		'Auth',
		function($scope, $http, $location, Auth) {
			$scope.login = function(credentials) {
				Auth.login(credentials);
			};
		}
	]);
	
	app.controller('registerController', [
		'$scope',
		'$http',
		'$location',
		'Auth',
		function($scope, $http, $location, Auth) {
			$scope.register = function(credentials) {
				if (credentials.password !== credentials.confirmPassword) {
					return false;
				} else {
					Auth.register(credentials);
				}
			}
		}
	])
	
	app.controller('createController', [
		'$scope',
		'http_service',
		'$http',
		'$location',
		function($scope, http_service, $http, $location) {
			$scope.create = function(inputs) {
				var params = {
					method: 'POST',
					url: api_url+'gigs/',
					data: {
						title: inputs.title,
						description: inputs.description,
						category: inputs.category,
						rolesNeeded: inputs.rolesNeeded,
						rolesFilled: inputs.rolesFilled
					}
				}
				http_service.backendCall(params).then(function(results) {
					$location.path('/gigs/'+results.data.id);
				})
			};
		}
	])
	
})();