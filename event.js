// context menu stuff
var showForPages = ["https://www.reddit.com/r/*"];

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
	var base = `https://oauth.reddit.com/r/${subreddit}/comments/${thingId}/`;
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

			alert(JSON.stringify(tokenJSON));


			
			
     	} else{
        	alert("Network error"); 
        }
    });
    tokenReq.send();
}
