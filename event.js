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
	var sub = parsed[4];
	var id = "t3_"+parsed[6]; //"t3" is a link, "t1" is a comment
	alert("sub: "+sub+"\nid: "+id);
}

//calls Reddit Api
function apiCall(obj) {
	alert(obj.linkUrl);
}