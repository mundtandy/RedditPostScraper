//initial
var client = {
    user_agent:"Reddit Post Scraper /u/thealus",
    client_id:"0f4OtyVmGL8KTw",
    secret:"aTyftlpiMHpS07G61V5eQszdqcI",

	response_type:"code",
	state:Math.random().toString(36).slice(2),
	redirect_uri:"http://reddit.com", //stored redirect_uri, needs to match
	duration:"temporary",
	scope:"read"

}

//add JS functionality to buttons 'Submit' and 'Clear'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
	document.getElementById("clear").addEventListener("click", clearHandler);
    document.getElementById("authorise").addEventListener("click", authorise);
});

setUserArea();

//methods

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
	toggleDisplay('haveToken', 'getToken');
}

//display log in div
function clearHandler() {
	//clear user details
	localStorage.removeItem('rppLogName');
	toggleDisplay('getToken', 'haveToken');
}

//submit login details
function submitHandler() {
	var logUn = document.getElementById('username').value;
	if(logUn == ''){
		alert("Please ensure both fields are filled correctly");
	} else {
		//Setting the value
		localStorage.setItem('rppLogName', logUn);
		//store user info
		document.getElementById('username').value = "";
		loggedUser();
	}
}

//authenticate user
function authorise() {
    var author = `https://www.reddit.com/api/v1/authorize?`
    +`client_id=${client.client_id}&response_type=${client.response_type}`
    +`&state=${client.state}&redirect_uri=${client.redirect_uri}`
    +`&duration=${client.duration}&scope=${client.scope}`

    chrome.tabs.update({
     url: author
    });
}

//helpers

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
