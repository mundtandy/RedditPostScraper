document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
});

// Detects Browser
function detectBrowser() { 
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
		setText('browser', 'Opera');
		browser = 'Opera';
	} else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		setText('browser', 'Chrome');
		//detect if using reddit
		chrome.tabs.getSelected(null, function(tab) {
			var tabUrl = new URL(tab.url).hostname
			var tabHost = tabUrl
			
			setText('website', (tabHost.match('www.reddit.com') ? 'yes!' : 'no!'))
		});
		
	} else if(navigator.userAgent.indexOf("Safari") != -1) {
		setText('browser', 'Safari');
		
	} else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
		setText('browser', 'Firefox');
		
	} else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) /*IF IE > 10*/ {
		setText('browser', 'Edge');
		
	} else {
		setText('browser', 'Invalid browser');
		setText('website', 'Unknown');
	}
}

function submitHandler() {
	alert("Hello");
}

//Helper Function to set text
function setText(ele, toChange){
	document.getElementById(ele).innerHTML += toChange;
}

detectBrowser();
onReddit();