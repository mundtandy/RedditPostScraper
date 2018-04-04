try {
/*
TODO:

Extract column headers to determine fields.

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
    var text = (new Date().getTime() < then.getTime() ? `Token expires: ${then.getHours()}:${then.getMinutes()}` : 'No Token');

    setText('currentToken', text, false);
}

//add JS functionality to buttons
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("token").addEventListener("click", tokenClick);
	document.getElementById("authorise").addEventListener("click", authoriseClick);
	document.getElementById("help").addEventListener("click", helpClick);
	document.getElementById("back").addEventListener("click", backClick);
    document.getElementById("fileSelect").addEventListener('change', handleFile, false);
});

//     methods
//help display
function helpClick() {
	toggleDisplay('helpDiv', 'popupContainerDiv');
}

//back display
function backClick() {
	toggleDisplay('popupContainerDiv', 'helpDiv');
}

var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
function handleFile(e) {
    var f = e.target.files[0];
    var reader = new FileReader();
    var workbook;

    reader.onload = function(e) {
        var data = e.target.result;

        workbook = X.read(data, {type: rABS ? 'binary' : 'array'});

		var worksheet = workbook.Sheets[getSheet(workbook.SheetNames)];

		var range = X.utils.decode_range(worksheet[["!ref"]]);

	 	var key = getKey(worksheet, range);

	 	localStorage.setItem('parseKey', JSON.stringify(key));
	}
    reader.readAsBinaryString(f);

    setText('currentFile', f.name, false);
    localStorage.setItem('fileName', f.name);
}

function getSheet(arr){
    if(arr.length > 1) {
        var stringtoshow = "";
        for (var i = 0; i < arr.length; i++) {
            stringtoshow += arr[i];
        }
        alert(stringtoshow);
    }
    return arr[0];
}

function getKey(ws, range){
    var key = [];

    var header;
    //parse thru columns of sheet
    for(var C=range.s.c; C<= range.e.c; C++) {
        //parse each row of that column for header info
        for(var R = range.s.r; R < 3; R++){
            var nextCell = ws[X.utils.encode_cell({r: R, c: C})];
            if( typeof nextCell !== 'undefined' )
                header = nextCell.w;

        }
        key.push(header);
    }

    return key;
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



} catch(err) {
    alert(err.message);
}

