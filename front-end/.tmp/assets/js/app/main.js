(function() {
    var gigs = [];
    var app = angular.module('sidegig', [ ]);
    
    app.controller('ResultsController', function() {
        this.gigs = gigs;
    });
	
	$(document).on('populate-gigs', function(event, data) {
		console.log(data);
		gigs = data.gigs;
		console.log(gigs);
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
	
	var api_url = "http://127.0.0.1:1337";
	
	$.ajax(api_url+'/gigs', {
		method: 'GET',
		dataType: 'json'
	}).done(function(data) {
		console.log(data);
		$(document).trigger('populate-gigs', {gigs: data});
	});
	
	$('form').on('submit', function(e) {
		e.preventDefault();
		var params = {
			title: $('#form-create input[name="title"]').val(),
			description: $('#form-create textarea').val()
		}
		
		$.ajax(api_url+'/gigs', {
			method: 'POST',
			data: params,
			dataType: 'json'
		}).done(function(data) {
			console.log(data);
			$('#form-create').toggleClass('active');
			$('#search-gigs, #gig-list').toggleClass('inactive');
			$(document).trigger('add-gig', {gig: data});
			$('input, textarea').val("");
		});
	});
	
	$('#create').on('click', function(e) {
		e.preventDefault();
		$('#form-create').toggleClass('active');
		$('#search-gigs, #gig-list').toggleClass('inactive');
	})
})();