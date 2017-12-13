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
		$.getJSON(parsed, function(jsn){
			alert(JSON.stringify(jsn));
		});
	}
}