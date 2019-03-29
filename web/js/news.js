let App = {
	debug: true,
	BASEURL: 'https://hacker-news.firebaseio.com/v0',
	NEWSTORIES: '/newstories.json',
	STORYITEM: '/item/{0}.json',
	SHOW_PER_PAGE: 30,
	stories: [],
	storyRequests: [] // tmp for Promises.all
}

function log(obj)
{
	if (App.debug) console.log(obj);
}

function getStoryDetails(obj) 
{
	var pr = new Promise(function(resolve, reject) {
		axios.get((App.BASEURL + App.STORYITEM).format(obj.id))
		.then(function(response) {
			log(response);
			var urlParts = parse_URL(response.data.url);
			response.data.baseUrl = '' + urlParts.protocol + '::/' + urlParts.host;
			obj = Object.assign(obj, response.data);
			resolve(obj);
		})
		.catch(function(error) {
			reject(error);
		})
	});
	return pr;
}

function getStories() 
{
	var pr = new Promise(function(resolve, reject) {
		axios.get(App.BASEURL + App.NEWSTORIES)
		.then(function (response) {
	  		var d = response.data.sort();
			d.slice(d.length - App.SHOW_PER_PAGE).forEach(id => {
				App.stories.push({id: id});
				App.storyRequests.push(getStoryDetails(App.stories[App.stories.length - 1]));
			});
	  		resolve(App.stories);
		})
		.catch(function (error) {
	  		reject(error);
		})
	});
	return pr;
}

function loadStoriesAction() 
{
	log('loadStoriesAction');
	getStories().then(function() {
		log(App.stories);
		Promise.all(App.storyRequests)
		.then(function(data) {
			log(App.stories);
		})
	});
}