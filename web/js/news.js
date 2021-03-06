let App = {
	debug: true,
	BASEURL: 'https://hacker-news.firebaseio.com/v0',
	NEWSTORIES: '/newstories.json',
	STORYITEM: '/item/{0}.json',
	USERDETAILS: '/user/{0}.json',
	SHOW_PER_PAGE: 30,
	stories: [],
	storyRequests: [], // tmp for Promises.all

	log: function(obj)
	{
		if (App.debug) console.log(obj);
	},

	getStoryDetails: function(obj) 
	{
		var pr = new Promise(function(resolve, reject) {
			axios.get((App.BASEURL + App.STORYITEM).format(obj.id))
			.then(function(response) {
				App.log(response);
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
	},

	getStories: function() 
	{
		var pr = new Promise(function(resolve, reject) {
			axios.get(App.BASEURL + App.NEWSTORIES)
			.then(function (response) {
				var d = response.data.sort();
				d.slice(d.length - App.SHOW_PER_PAGE).forEach(id => {
					App.stories.push({id: id});
					App.storyRequests.push(App.getStoryDetails(App.stories[App.stories.length - 1]));
				});
				resolve(App.stories);
			})
			.catch(function (error) {
				reject(error);
			})
		});
		return pr;
	},


	// @TODO hide, ago to be clickable
	showStories: function() 
	{
		var out = '';
		App.stories.reverse().forEach((el,idx) => {
			out += 
			`<tr class='athing' id='${el.id}'>
					<td align="right" valign="top" class="title"><span class="rank">${idx+1}.</span></td>
					<td valign="top" class="votelinks">
						<center>
							<a id='up_${el.id}' href='vote?id=${el.id}&amp;how=up&amp;goto=news'>
								<div class='votearrow' title='upvote'></div>
							</a>
						</center>
					</td>
					<td class="title">
						<a href="${el.url}" class="storylink">${el.title}</a>
						<span class="sitebit comhead"> 
							(<a href="from?site=${el.baseUrl}">
								<span class="sitestr">${el.baseUrl}</span>
							</a>)
						</span>
					</td>
					</tr>
					<tr>
					<td colspan="2"></td>
					<td class="subtext">
						<span class="score" id="score_${el.id}">${el.score} point${el.score>1?'s':''}</span> by 
						<a href="/index_dev.php/user/${el.by}" class="hnuser">${el.by}</a> 
						<span class="age"><a href="#">${moment(moment.unix(el.time)).fromNow()}</a></span> 
						<span id="unv_${el.id}"></span> | 
							<a href="#">hide</a> | <a href="item?id=19497878">${el.descendants}&nbsp;comments</a>              
					</td>
					</tr>
					<tr class="spacer" style="height:5px"></tr>`	
	;		
		});
		document.getElementById('t_stories').innerHTML = out;
	},

	loadStoriesAction: function() 
	{
		App.log('loadStoriesAction');
		App.getStories().then(function() {
			App.log(App.stories);
			Promise.all(App.storyRequests)
			.then(function(data) {
				App.log(App.stories);
				App.showStories();
			})
		});
	},

	// 
	//
	//
	userDetailsAction: function(username) 
	{
		axios.get((App.BASEURL + App.USERDETAILS).format(username))
		.then(function(response) {
			App.showUserDetails(response.data);
		})
		.catch(function(error) {
			App.log(error);
		})
	},


	// @TODO submitted, threads, favorites to be clickable
	showUserDetails: function(obj)
	{
		var out = 
			`<tr class="athing"><td valign="top">user:</td><td timestamp="${obj.created}"><a href="user?id=${obj.id}" class="hnuser">${obj.id}</a></td></tr>
			<tr><td valign="top">created:</td><td><a href="front?day=${moment(moment.unix(obj.created)).format('YYYY-MM-D')}&amp;birth=${obj.id}">${moment(moment.unix(obj.created)).format('MMMM D, YYYY')}</a></td></tr>
			<tr><td valign="top">karma:</td><td>${obj.karma}</td></tr>
			<tr><td valign="top">about:</td><td>${obj.about || ''}</td></tr>
			<tr><td></td><td><a href="#"><u>submissions</u></a></td></tr>
			<tr><td></td><td><a href="#"><u>comments</u></a></td></tr>
			<tr><td></td><td><a href="#"><u>favorites</u></a>
			</td></tr>`;
		document.getElementById('t_user_details').innerHTML = out;
	}

}