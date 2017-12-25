var showForPages = ["https://www.reddit.com/r/*"];
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// Set up the context menus
chrome.contextMenus.create({
	"title": "Parse Reddit Post",
	"contexts": ["link"],
	"targetUrlPatterns": showForPages,
	"onclick" : function(obj) {
		parseUrl(obj.linkUrl);
		//apiCall(obj);
	}
});

//parse url
function parseUrl(url){
	var parsed = url.split("/");
	if(parsed.length < 7)
		alert('Please select a reddit post comment to parse');
	else {
		
		parseThing(parsed[4], parsed[6]);
	}
}

/*
 var url = https://oauth.reddit.com;
 
 	
*/

//gets value stored in local Storage
function loadVal(toLoad){
	var toReturn = localStorage.getItem(toLoad);

	return (toReturn === null? null : (toReturn));
}

function parseThing(subreddit, thingId) {
	var tokenReq = new XMLHttpRequest();
	var base = `https://oauth.reddit.com/by_id/t3_${thingId}`;
	var token = loadVal('rAccToken');

	alert(base);
	
   	tokenReq.open('GET', base, true); 
	  
	tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   	tokenReq.setRequestHeader('User-Agent', 'Reddit Post Scraper /u/thealus');
   	tokenReq.setRequestHeader('Authorization', `bearer ${token}`);
   
	alert(`bearer ${token}`);

	tokenReq.addEventListener('load', function(){
   		alert(tokenReq.status);
	   
		if(tokenReq.status >= 200 && tokenReq.status < 400){
			var tokenJSON = JSON.parse(tokenReq.responseText);
			
			var postJSON = tokenJSON.data.children[0].data;
			//NUMBER

			//PARSE-ABLE
			var timeUTC = new Date(postJSON.created_utc*1000);
			//time posted (GMT/UTC)
			
				//Day
			var day = days[timeUTC.getDay()];
				//Date (DD/MM/YYYY)
			var date = `${timeUTC.getDate()}/${timeUTC.getMonth()+1}/${timeUTC.getFullYear()}`
			//TITLE
			var title = postJSON.title;
			//USERNAME (link)
			var un = `=HYPERLINK("https://www.reddit.com/user/${postJSON.author}","${postJSON.author}")`;
			//POINTS (score)
			var points = postJSON.score;
			//COMMENTS (number of)
			var comments = postJSON.num_comments;
			//LINK
			var link = `=HYPERLINK("https://www.reddit.com${postJSON.permalink}")`;
			//MAYBE NOT PARSEABLE
			//OP SOURCE,TYPE (5 options, mark with X) ,CODE,LOOKING FOR,A or P, Found Source, Found?, Notes, Removal + Re-Request

			alert(`Day: ${day}\nDate: ${date}\nTitle: ${title}\nUserName: ${un}\nPoints: ${points}\nComments: ${comments}\nLink: ${link}`)
			
			


			
			
     	} else{
        	alert("Network error"); 
        }
    });
    tokenReq.send();
}
