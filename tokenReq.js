function tokenGet() {
	//var tokenReq = new XMLHttpRequest();
	
	//var logUn = document.getElementById('username').value;
	//if(logUn != ''){
		
		//Setting the value
		localStorage.setItem('rppLogName', logUn);
		//store user info
		document.getElementById('username').value = "";
		loggedUser();
		
	//}
}