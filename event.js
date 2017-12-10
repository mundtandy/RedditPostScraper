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
		var parsed = url+'.json';
		
		alert(parsed);
		parseThing();
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

function parseThing() {
	var tokenReq = new XMLHttpRequest();

	var base = 'https://oauth.reddit.com/api/v1/me';
	var token = loadVal('rAccToken');
	
   	tokenReq.open('GET', base, true); 
	  
	tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   	tokenReq.setRequestHeader('User-Agent', 'Reddit Post Scraper /u/thealus');
   	tokenReq.setRequestHeader('Authorization', `bearer ${token}`);
   
	alert(`bearer ${token}`);

	tokenReq.addEventListener('load', function(){
   		alert(tokenReq.status);
	   
		if(tokenReq.status >= 200 && tokenReq.status < 400){
			var tokenJSON = JSON.parse(tokenReq.responseText);

			alert(tokenReq.responseText);
			
			
     	} else{
        	alert("Network error"); 
        }
    });
    tokenReq.send();
}
