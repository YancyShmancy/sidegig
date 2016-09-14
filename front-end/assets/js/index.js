(function() {
	$(".button-collapse").sideNav();
    var gigs = [];
	var singleGig = {};
	var href;
    var app = angular.module('sidegig', ['ngRoute' ]);
	var api_url = "http://127.0.0.1:1337/";
	
	app.config(function($routeProvider) {
		
		$routeProvider
		
		.when('/', {
			templateUrl: '../pages/home.html',
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
	})
	
	app.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	})
	
	app.constant('USER_ROLES', {
		all: '*',
		admin: 'admin',
		editor: 'editor',
		guest: 'guest'
	})
	
	app.factory('AuthService', function($http, Session) {
		var authService = {};
		
		authService.login = function (credentials) {
			return $http
					.post(api_url+'users/login', credentials)
					.then(function (res) {
//						console.log(res);
						Session.create(res.data.sessionID, res.data.user.id, res.data.user.role);
						
						return res.data.user;
					});
		};
		
		authService.isAuthenticated = function() {
			console.log("authService.isAuthenticated", !!Session.userId);
			return !!Session.userId;
		};
		
		authService.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
		};
		
		return authService;
	});
	
	app.service('Session', function() {
		this.create = function (sessionId, userId, userRole) {
			this.id = sessionId;
			this.userId = userId;
			this.userRole = userRole;
			
			console.log("creating session", this);
		};
		
		this.destroy = function () {
			this.id = null;
			this.userId = null;
			this.userRole = null;
		}
	});
	
	app.controller('ApplicationController', function($scope, USER_ROLES, AuthService) {
		$scope.currentUser = null;
		$scope.userRoles = USER_ROLES;
		$scope.isAuthorized = AuthService.isAuthorized;
		
		$scope.setCurrentUser = function(user) {
			$scope.currentUser = user;
		}
	});
	
	app.controller('LoginController', function ($location, $scope, $rootScope, AUTH_EVENTS, AuthService) {
		$scope.credentials = {
			username: '',
			password: ''
		};
		
		$scope.login = function(credentials) {
			AuthService.login(credentials).then(function (user) {
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$scope.setCurrentUser(user);
				
				$location.path('/');
			}, function() {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			});
		};
	})
	
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
		function($scope, $http) {
			
//			$('.login-form').on('submit', function(e) {
//				e.preventDefault();
//				$http({
//					method: 'post',
//					url: api_url+'users/login',
//					data: {
//						username: $('.login-form input[name="username"]').val(),
//						password: $('.login-form input[name="password"]').val()
//					},
//					dataType: 'json'
//				}).success(function(data) {
//					console.log(data);
//				})
//			})
		}
	])
	
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