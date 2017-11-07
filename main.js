var browser;

//add JS functionality to buttons 'Submit' and 'Clear'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
});

//add JS functionality to buttons 'Submit' and 'Clear'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("clear").addEventListener("click", clearHandler);
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
	//user doesn't exist
	clearHandler()
	//if stored user exists
	//else
		//setFresh()
}



//submit login details
function submitHandler() {
	document.getElementById('username').value = "";
    document.getElementById('password').value = "";
	
	toggleDisplay('userAreaExist', 'userAreaNew');
	
}

function clearHandler() {
	toggleDisplay('userAreaNew', 'userAreaExist');
	
	//clear user
	
	//refresh panel
	
	
	
}

//Helper Function to set text
function setText(ele, toChange){
	document.getElementById(ele).innerHTML += toChange;
}

//Helper Function to toggle between login/user div
function toggleDisplay(div1, div2) {
	document.getElementById(div1).style.display = 'block';
	document.getElementById(div2).style.display = 'none';	
}

browser = detectBrowser()
setText('browser', browser)
onReddit()
setUserArea()