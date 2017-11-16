//initial

//add JS functionality to buttons 'Submit' and 'Clear'
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("submit").addEventListener("click", submitHandler);
	document.getElementById("clear").addEventListener("click", clearHandler);
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
	toggleDisplay('userAreaExist', 'userAreaNew');
}

//display log in div
function clearHandler() {
	//clear user details
	localStorage.removeItem('rppLogName');
		
	toggleDisplay('userAreaNew', 'userAreaExist');
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