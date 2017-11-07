var browser;

//add JS functionality to button 'Submit'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
});

// Detects Browser
function detectBrowser() { 
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
		return 'Opera'
	} else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		return 'Chrome'
	} else if(navigator.userAgent.indexOf("Safari") != -1) {
		return 'Safari'
	} else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
		return 'Firefox'
	} else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) /*IF IE > 10*/ {
		return 'Edge'
	} else {
		return 'Invalid browser'
	}
}

//detects hostname of current website URL, using browser specific function
function onReddit(){
	var tx = 'website'
	switch(browser) {
		case 'Opera' :
			//toAdd Opera version
			break;
		case 'Chrome' :
			chrome.tabs.getSelected(null, function(tab) {
				var urlHost = new URL(tab.url).hostname
				setText(tx, (urlHost.match('www.reddit.com') ? 'yes' : 'no'))
			});
			break;
		case 'Safari' :
			//toAdd Safari version
			break;
		case 'Firefox' :
			//toAdd Firefox version
			break;
		case 'Edge' :
			//toAdd Edge version
			break;
		default :
			setText(tx, 'Unknown')
	}
}

//sets user area based on previous login details
function setUserArea() {
	//if stored user exists
		//setExists()
	//else
		setFresh()
}

function setFresh() {
	document.getElementById("userArea").innerHTML="Username:<br>"
	+"<input type=\"text\" name=\"username\"><br>"
	+"Password:<br>"
	+"<input type=\"password\" name=\"password\">"
	+"<button id=\"submit\">Submit</button>"; 
}

//submit login details
function submitHandler() {
	alert("Hello");
}

//Helper Function to set text
function setText(ele, toChange){
	document.getElementById(ele).innerHTML += toChange;
}

browser = detectBrowser()
setText('browser', browser)
onReddit()
setUserArea()