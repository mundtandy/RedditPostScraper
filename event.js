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
		var sub = parsed[4];
		var id = "t3_"+parsed[6]; //"t3" is a link, "t1" is a comment
		
		apiCall("Hello sub: "+sub+"\nid: "+id)
	}
}

//calls Reddit Api
function apiCall(obj) {
	var tokenReq = new XMLHttpRequest();
	alert(obj);
	
	//Now we do API STUFF
}

