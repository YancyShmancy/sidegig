(function() {
    var gigs = [];
	
    var app = angular.module('sidegig', [ ]);
//    app.value('gigs', gigs);
	
    app.controller('sidegigController', [ '$scope',
		function($scope) {
			$scope.gigs = gigs;
		}
	]);
	
	$(document).on('populate-gigs', function(event, data) {
		console.log(data);
		gigs = data.gigs;
//		scope.gigs = data.gigs;
//		console.log(gigs);
	});
    
	$(document).on('add-gig', function(event, data) {
		gigs.push(data.gig);
		console.log("Gig added: ", data.gig, gigs);
	});
    
    app.controller('PanelController', function() {
        this.tab = 1;
        
        this.selectTab = function(setTab) {
            this.tab = setTab;
        };
        this.isSelected = function(checkTab) {
            return this.tab === checkTab;
        }
    });
})();

(function() {
	
	$('.modal-trigger').leanModal();
	
	var api_url = "http://127.0.0.1:1337";
	
	$.ajax(api_url+'/gigs', {
		method: 'GET',
		dataType: 'json'
	}).done(function(data) {
		console.log(data);
		$(document).trigger('populate-gigs', {gigs: data});
	});
	
	$('form.submit-gig').on('submit', function(e) {
		e.preventDefault();
		var params = {
			title: $('.submit-gig input[name="title"]').val(),
			description: $('.submit-gig textarea').val()
		}
		
		$.ajax(api_url+'/gigs', {
			method: 'POST',
			data: params,
			dataType: 'json'
		}).done(function(data) {
			console.log(data);
			$('#create-gig').closeModal();
			$(document).trigger('add-gig', {gig: data});
			$('input, textarea').val("");
		});
	});
	
	$('form.login-form').on('submit', function(e) {
		e.preventDefault();
		var params = {
			username: $('.login-form input[name="username"]').val(),
			password: $('.login-form input[name="password"]').val()
		}
		
		$.ajax(api_url+'/users/login', {
			method: 'POST',
			data: params
		}).done(function(data) {
			console.log(data);
			$('#login-modal').closeModal();
		}).fail(function(err) {
			console.log(err);
		})
	});
	
//	$('#create-btn').on('click', function(e) {
//		$('#create-gig').openModal();
//	});
	
})();