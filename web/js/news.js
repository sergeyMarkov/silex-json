let App = {
	debug: true,
	BASEURL: 'https://hacker-news.firebaseio.com/v0',
	STORYITEM: '/item/{0}.json',
	stories: []
}

function log(obj)
{
	if (App.debug) console.log(obj);
}

function getStoryDetails(obj) 
{
	axios.get((App.BASEURL + App.STORYITEM).format(obj.id))
	.then(function(response) {
		log(response);
		var urlParts = parse_URL(response.data.url);
		response.data.baseUrl = '' + urlParts.protocol + '::/' + urlParts.host;
		obj = Object.assign(obj, response.data);
	})
	.catch(function(error) {
		log(error);
	});
}