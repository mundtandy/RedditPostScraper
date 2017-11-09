var browser;

//add JS functionality to buttons 'Submit' and 'Clear'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
	document.getElementById("clear").addEventListener("click", clearHandler);
});

browser = detectBrowser();
setText('browser', browser, true);
onReddit();
setUserArea();

// Detects Browser
function detectBrowser() { 
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
		return 'Opera';
	} else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		return 'Chrome';
	} else if(navigator.userAgent.indexOf("Safari") != -1) {
		return 'Safari';
	} else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
		return 'Firefox';
	} else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode === true )) /*IF IE > 10*/ {
		return 'Edge';
	} else {
		return 'Invalid browser';
	}
}

//detects hostname of current website URL, using browser specific function
function onReddit(){
	var tx = 'website';
	switch(browser) {
		case 'Opera' :
			//toAdd Opera version
			break;
		case 'Chrome' :
			chrome.tabs.getSelected(null, function(tab) {
				var urlHost = new URL(tab.url).hostname;
				setText(tx, (urlHost.match('www.reddit.com') ? 'yes' : 'no'), true);
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
			setText(tx, 'Unknown', true);
	}
}

//sets user area based on previous login details
function setUserArea() {
	if (loadVal('rppLogName') === null) { //user doesn't exist
		clearHandler();
	} else { //user does
		loggedUser();
	}
}

//gets value stored in local Storage
function loadVal(toLoad){
	var toReturn = localStorage.getItem(toLoad);
	
	return (toReturn === null? null : (toReturn));
}

//display logged in div
function loggedUser(){
	var current = 'Current User: '+loadVal('rppLogName');
	
	setText('cUser', current, false);
	toggleDisplay('userAreaExist', 'userAreaNew');
}

//display log in div
function clearHandler() {
	//clear user details
	localStorage.removeItem('rppLogName');
	localStorage.removeItem('rppLogPass');
	
	toggleDisplay('userAreaNew', 'userAreaExist');
}

//submit login details
function submitHandler() {
	var logUn = document.getElementById('username').value;
	var logPw = document.getElementById('password').value;
	
	if(logUn == '' || logPw == ''){
		alert("Please ensure both fields are filled correctly");
	} else {
		//Setting the value
		localStorage.setItem('rppLogName', logUn);
		localStorage.setItem('rppLogPass', logPw);
		
		//store user info	
		document.getElementById('username').value = "";
		document.getElementById('password').value = "";
		
		loggedUser();
	}
}

//Helper Function to set text
function setText(ele, toChange, concat){
	if(concat) {
		document.getElementById(ele).innerHTML += toChange;
	} else {
		document.getElementById(ele).innerHTML = toChange;
	}
}

//Helper Function to toggle between login/user div
function toggleDisplay(div1, div2) {
	document.getElementById(div1).style.display = 'block';
	document.getElementById(div2).style.display = 'none';	
}