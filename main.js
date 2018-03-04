/*
rTokenStatus: Used to determine if a refresh token code has been received. 0 or 1
rAccToken: Current access token.
rTokenOut: Time current token will expire
rRefToken: Refresh Token.
*/

//initial
var client = {
    user_agent:"Reddit Post Scraper /u/thealus",
    client_id:"0f4OtyVmGL8KTw",
    secret:"aTyftlpiMHpS07G61V5eQszdqcI",

	response_type:"code",
	state:Math.random().toString(36).slice(2),
	redirect_uri:"http://reddit.com", //stored redirect_uri, needs to match
	duration:"permanent",
	scope:"read"
}

if(loadVal('rTokenStatus') === null) {
	localStorage.setItem('rTokenStatus', '0');
}

//set token text
if(loadVal('rTokenOut') !== null) {
    var then = new Date(loadVal('rTokenOut'));
    //thenTime = then.getTime();
    var text = (new Date().getTime() < then.getTime() ? `Token expires: ${then.getHours()}:${then.getMinutes()}` : 'No Token');

    setText('currentToken', text, false);
}

//file upload
var inputElement = document.getElementById("fileSelect");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
//    alert('helo');
    var fileList = this.files; /* now you can work with the file list */
    setText('currentFile', fileList[0].name, false);
}
//set file text

//add JS functionality to buttons
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("token").addEventListener("click", tokenClick);
	document.getElementById("authorise").addEventListener("click", authoriseClick);
	document.getElementById("help").addEventListener("click", helpClick);
	document.getElementById("back").addEventListener("click", backClick);

});

//methods
//file upload
var inputElement = document.getElementById("fileSelect");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
//    alert('helo');
    var fileList = this.files; /* now you can work with the file list */
    setText('currentFile', fileList[0].name, false);
}

//submit login details
function tokenClick() {
	if (loadVal('rTokenStatus') === '0') { //if first time
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			var curUrl = (tabs[0].url).toString();

			var index = (curUrl).search('&code=');

			if(index == -1)
				alert('Please re-authorise, and attempt again after being redirected');
			else {
				var authCode = curUrl.slice(index+6);

				//alert(authCode);
				tokenGet(authCode, true);
			}
		});
	} else { //if only need to get refresh token
		tokenGet('', false);
	}



}


//FIXME: Parse Json,

//var returned = thing{
//	"access_token": "46LU7sVxIuAmP14uQPBLwu05dqc",
//	"token_type": "bearer",
//	"expires_in": 3600,
//	"refresh_token": "19684574-MbZDnv-WYQf8K_tHaurp8YOTXA4",
//	"scope": "read"
//	}
function tokenGet(authCode, newToken) {
	var tokenReq = new XMLHttpRequest();

	var base = 'https://www.reddit.com/api/v1/access_token';
	var clientID = client.client_id;
	var secret = client.secret;
	var refToken = loadVal('rRefToken');

	var postData = (newToken ? `grant_type=authorization_code&code=${authCode}&redirect_uri=${client.redirect_uri}` : `grant_type=refresh_token&refresh_token=${refToken}`);

	alert(postData);

   	tokenReq.open('POST', base, true);

   	tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   	tokenReq.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secret));

	tokenReq.addEventListener('load', function(){
   	//	alert(tokenReq.status);
        if(tokenReq.status >= 200 && tokenReq.status < 400){
			var tokenJSON = JSON.parse(tokenReq.responseText);

			var now = new Date();
			now.setTime(now.getTime() + (60*60*1000));

			localStorage.setItem('rTokenStatus', '1');
			localStorage.setItem('rAccToken', tokenJSON.access_token);

            var curTime = now.toString();
			localStorage.setItem('rTokenOut', curTime);
            setText('currentToken', `Token expires: ${now.getHours()}:${now.getMinutes()}`, false);

			if(newToken){
				localStorage.setItem('rRefToken', tokenJSON.refresh_token);
			}

			alert(`${now.getHours()}:${now.getMinutes()}`);

			alert('Token received!');

     	} else{
        	alert("Network error");
        }
    });
    tokenReq.send(postData);
}

//authenticate user
function authoriseClick() {
	localStorage.setItem('rTokenStatus', '0');
	cullStorage();

    var author = `https://www.reddit.com/api/v1/authorize?`
    +`client_id=${client.client_id}&response_type=${client.response_type}`
    +`&state=${client.state}&redirect_uri=${client.redirect_uri}`
    +`&duration=${client.duration}&scope=${client.scope}`

    chrome.tabs.create({
     url: author
    });
}

//removes stored token information
function cullStorage(){
	localStorage.removeItem('rAccToken');
	localStorage.removeItem('rTokenOut');
	localStorage.removeItem('rRefToken');
}

//help display
function helpClick() {
	toggleDisplay('helpDiv', 'popupContainerDiv');
}

//back display
function backClick() {
	toggleDisplay('popupContainerDiv', 'helpDiv');
}

            //-- helpers

//gets value stored in local Storage
function loadVal(toLoad){
	var toReturn = localStorage.getItem(toLoad);

	return (toReturn === null? null : (toReturn));
}


//Heper function to change non-button setText
function setButton(ele, text){
    document.getElementById(ele).innerHTML=text;
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
