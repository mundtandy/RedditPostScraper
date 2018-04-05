
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
    toggleDisplay('haveFile', 'getFile', true);
}

function getSheet(arr){
    if(arr.length > 1) {
        var stringtoshow = "";
        for (var i = 0; i < arr.length; i++) {
            stringtoshow += arr[i];
        }

    }
    //TODO add functionality to select sheet

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

function parseJSON(jsOBJ){
    var index = 0;
    alert(jsOBJ.data.dist);
    //for(var i = 0; i < tokenJSON.data.dist; i++) {
    var postJSON = jsOBJ.data.children[1].data;

    //NUMBER
    var indexNum = index++;
    //PARSE-ABLE
    var timeUTC = new Date(postJSON.created_utc * 1000);
    //time posted (GMT/UTC)

    //Day
    var day = days[timeUTC.getDay()];
    //Date (DD/MM/YYYY)
    var date = `${timeUTC.getDate()}/${timeUTC.getMonth() + 1}/${timeUTC.getFullYear()}`
    //Time
    var hour = `${timeUTC.getHours()}:${timeUTC.getMinutes()}:${timeUTC.getSeconds()}`;
    //TITLE
    var title = postJSON.title;
    //USERNAME (link)
    var un = `=HYPERLINK("https://www.reddit.com/user/${postJSON.author}","${postJSON.author}")`;
    //POINTS (score)
    var points = postJSON.score;
    //COMMENTS (number of)
    var comments = postJSON.num_comments;
    //LINK
    var link = `=HYPERLINK("https://www.reddit.com${postJSON.permalink}")`;

    var tag = postJSON.link_flair_text;
    //MAYBE NOT PARSEABLE
    //OP SOURCE,TYPE (5 options, mark with X) ,CODE,LOOKING FOR,A or P, Found Source, Found?, Notes, Removal + Re-Request

    alert(`#: ${indexNum}\nDay: ${day}\nDate: ${date}\nTitle: ${title}\nUserName: ${un}\nPoints: ${points}\nComments: ${comments}\nLink: ${link}`);

    // }
}

function parseToWS(finalArr){

}