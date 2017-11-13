// context menu stuff
var showForPages = ["https://www.reddit.com/r/*/*"];

// Set up the context menus
chrome.contextMenus.create({
	"title": "Parse Reddit Post",
	"contexts": ["link"],
	"targetUrlPatterns": showForPages,
	"onclick" : function(e) {
		alert("hello");
	}
});