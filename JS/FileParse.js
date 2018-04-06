var X = XLSX;

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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
    //alert(jsOBJ.data.dist);
    var parsedFinal = [];
    for(var i = 0; i < jsOBJ.data.dist; i++) {
        var postJSON = jsOBJ.data.children[i].data;
        var temp = [];
        //NUMBER
        //var indexNum = index++;
        temp.push(index++);
        //PARSE-ABLE
        var timeUTC = new Date(postJSON.created_utc * 1000);
        //time posted (GMT/UTC)

        //Day
        //var day = days[timeUTC.getDay()];
        temp.push(days[timeUTC.getDay()]);
        //Date (DD/MM/YYYY)
        var date = `${timeUTC.getDate()}/${timeUTC.getMonth() + 1}/${timeUTC.getFullYear()}`
        temp.push(date);
        //Time
        var hour = `${timeUTC.getHours()}:${timeUTC.getMinutes()}:${timeUTC.getSeconds()}`;
        temp.push(hour);
        //TITLE
        var title = postJSON.title;
        temp.push(title);
        //USERNAME (link)
        var un = `=HYPERLINK("https://www.reddit.com/user/${postJSON.author}","${postJSON.author}")`;
        temp.push(un);
        //POINTS (score)
        var points = postJSON.score;
        temp.push(points);
        //COMMENTS (number of)
        var comments = postJSON.num_comments;
        temp.push(comments);
        //LINK
        var link = `=HYPERLINK("https://www.reddit.com${postJSON.permalink}")`;
        temp.push(link);
        var tag = postJSON.link_flair_text;
        temp.push(tag);
        //MAYBE NOT PARSEABLE
        //OP SOURCE,TYPE (5 options, mark with X) ,CODE,LOOKING FOR,A or P, Found Source, Found?, Notes, Removal + Re-Request

        parsedFinal.push(temp);
        //alert(`#: ${indexNum}\nDay: ${day}\nDate: ${date}\nTitle: ${title}\nUserName: ${un}\nPoints: ${points}\nComments: ${comments}\nLink: ${link}`);
    }


    return parsedFinal;
}

function writeToFile(toWrite){
    alert("At To Write: "+toWrite.length);
}

