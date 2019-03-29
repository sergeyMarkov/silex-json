log('started');

window.addEventListener("load", function(event) {
	
	// routing
	var urlParts = parse_URL(window.location);
	var route = urlParts.segments[1] || 'root';
	switch(route) {
		default:
			log('default route loading..');
	}

});