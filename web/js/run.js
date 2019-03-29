App.log('app started');

window.addEventListener("load", function(event) {
	
	// routing
	var urlParts = parse_URL(window.location);
	var route = urlParts.segments[1] || 'root';
	switch(route) {
		case 'user':
			App.userDetailsAction(urlParts.segments[2] || '');
			break;
		default:
			App.log('default route loading..');
			App.loadStoriesAction();
	}

});