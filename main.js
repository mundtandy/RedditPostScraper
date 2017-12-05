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

//add JS functionality to buttons
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("token").addEventListener("click", tokenClick);
	document.getElementById("clear").addEventListener("click", clearHandler);
    document.getElementById("authorise").addEventListener("click", authoriseClick);
	document.getElementById("help").addEventListener("click", helpClick);
	document.getElementById("back").addEventListener("click", backClick);
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
	
	toggleDisplay('haveToken', 'getToken');
}

//display log in div
function clearHandler() {
	//clear user details
	
	toggleDisplay('getToken', 'haveToken');
}

//submit login details
function tokenClick() {
	//if first time
	//if(localstorage blahblah)
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
	
	
	//} else {
		//in this situation, get a refresh token!
	//}
	//loggedUser();
		
	
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
	
	var postData = (newToken ? `grant_type=authorization_code&code=${authCode}&redirect_uri=${client.redirect_uri}` : `grant_type=refresh_token&refresh_token=${refToken}`);
	
	alert(postData);
   	tokenReq.open('POST', base, true); 
   
   	tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   	tokenReq.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secret));
   
	tokenReq.addEventListener('load', function(){
   		alert(tokenReq.status);
        if(tokenReq.status >= 200 && tokenReq.status < 400){
			var tokenJSON = JSON.parse(tokenReq.responseText);
			alert(tokenJSON.scope);	   
			   alert(response);
			   

     	} else{
        	alert("Network error"); 
        }
    });
    tokenReq.send(postData);
}
/*
function refreshGet(refToken){
	var tokenReq = new XMLHttpRequest();

	var base = 'https://www.reddit.com/api/v1/access_token';
	var clientID = client.client_id;
	var secret = client.secret;  
	
	var postData = `grant_type=refresh_token&refresh_token=${refToken}`;

	tokenReq.open('POST', base, true); 
	
	tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	tokenReq.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secret));

	tokenReq.addEventListener('load', function(){
        //alert(tokenReq.status);
        if(tokenReq.status >= 200 && tokenReq.status < 400){
			var tokenJSON = JSON.parse(tokenReq.responseText);
			alert(tokenJSON.scope);	   
           //alert(response);
       }
         //   else{
         //       alert("Network error"); 
          //  }
        });//end load function
    tokenReq.send(postData);

}
*/
//authenticate user
function authoriseClick() {
    var author = `https://www.reddit.com/api/v1/authorize?`
    +`client_id=${client.client_id}&response_type=${client.response_type}`
    +`&state=${client.state}&redirect_uri=${client.redirect_uri}`
    +`&duration=${client.duration}&scope=${client.scope}`
	
    chrome.tabs.create({
     url: author
    });
}

//https://www.reddit.com/?state=coiq3zow5u&code=ankXmh0GAEhGUMgIc0ekxh7vTvM

//help display
function helpClick() {

	var reUrl = chrome.extension.getURL('h/m.js').replace('h/m.js', '') + 'redirect.html';
	
	chrome.tabs.create({
		url: reUrl
    });
	
	//toggleDisplay('helpDiv', 'popupContainerDiv');
}

//back display
function backClick() {
	toggleDisplay('popupContainerDiv', 'helpDiv');
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
