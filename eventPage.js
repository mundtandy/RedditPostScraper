var contextMenuItem = {
	"id": "apiSearch",
	"title": "Get Metadata",
	"contexts": ["link"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){
	if(clickData.menuItemId == "apiSearch"){
		alert('yay');
	}
}