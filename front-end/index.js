(function() {
	
	var api_url = "http://127.0.0.1:1337";
	
	$.ajax(api_url+'/gigs', {
		method: 'GET',
		dataType: 'json'
	}).done(function(data) {
		console.log(data);
	});
	
	$('form').on('submit', function(e) {
		e.preventDefault();
		var params = {
			title: $('input[name="title"]').val(),
			description: $('textarea').val()
		}
		
		$.ajax(api_url+'/gigs', {
			method: 'POST',
			data: params,
			dataType: 'json'
		}).done(function(data) {
			console.log(data);
			
			$('input, textarea').val("");
		})
	})
	
})();