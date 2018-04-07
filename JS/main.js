try {
	/*
	TODO:

	Extract column headers to determine fields. (done)

	Fix Token TIME issue.

	Examine Reddit search by subreddit api.

	search by top/recent etc, date?

	Gather n posts satisfying above post

	Place into excel (named by search maybes)
	 */

	var X = XLSX;



   	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // All File Api work
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}

	// Handle vendor prefixes.

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
		var text = (validTime() ? `Token expires: ${then.getHours()}:${then.getMinutes()}` : 'No Token');

		setText('currentToken', text, false);
	}

	if(loadVal('fileName') !== null) {
        toggleDisplay('haveFile', 'getFile', true);
        setText('currentFile', loadVal('fileName'), false);
	}

	//add JS functionality to buttons
	document.addEventListener('DOMContentLoaded', function() {
		document.getElementById("token").addEventListener("click", tokenClick);
		document.getElementById("authorise").addEventListener("click", authoriseClick);
		document.getElementById("help").addEventListener("click", helpClick);
		document.getElementById("back").addEventListener("click", backClick);
		document.getElementById("fileSelect").addEventListener('change', handleFile, false);
        document.getElementById("changeFile").addEventListener('click', dropFile);
        document.getElementById("enterSearch").addEventListener('click', enterClick);
       	document.getElementById("backSearch").addEventListener('click', backSearchClick);
        document.getElementById("parse").addEventListener('click', parse);

	});

    function dropFile() {
        localStorage.removeItem('fileName');
        localStorage.removeItem('parseKey');
        toggleDisplay('getFile', 'haveFile', true);
    }

			//-- methods
	//help display
	function helpClick() {
		toggleDisplay('helpDiv', 'popupContainerDiv', false);
	}

	//back display
	function backClick() {
		toggleDisplay('popupContainerDiv', 'helpDiv', false);
	}


    function backSearchClick() {
        setText('subredditSearch', 'No Subreddit', false);
        toggleDisplay('popupContainerDiv', 'searchOptions',  false);
	}

	function enterClick() {
		if(loadVal('parseKey') === null) {
			alert("Please Import a valid file");
		} else if(loadVal('rAccToken') === null) {
			alert("Please get a Token");
		} else if(!validTime()) {
			alert("Token expired, please get a new one.")
		} else {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                var curUrl = (tabs[0].url).toString();
                if(!curUrl.startsWith('https://www.reddit.com/r/')){
                	alert("Please navigate to the subreddit you wish to scrape posts from.");
				} else {
                    var subreddit = curUrl.split("/")[4];
                    setText('subredditSearch', subreddit, false);
                   // parseThing(subreddit, '0', 100);
                    toggleDisplay('searchOptions', 'popupContainerDiv', false);
				}
            });
		}
	}

	function parse() {
    	var subreddit = document.getElementById('subredditSearch').innerHTML;

    	var type = document.querySelector('input[name="searchType"]:checked').value;

    	var nums = document.querySelector('input[name="postsNum"]').value;

    	var returned = parseThing(subreddit, type, nums);
    	alert("Vals:"+returned);
	}

	function validTime(){
		var then = new Date(loadVal('rTokenOut'));
		//thenTime = then.getTime();
		return new Date().getTime() < then.getTime();
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
	function toggleDisplay(div1, div2, panel) {
		document.getElementById(div1).style.display = (panel ? 'flex' : 'block');
		document.getElementById(div2).style.display = 'none';
	}



} catch(err) {
    alert(err.lineNumber +"\n"+err.message);
}

