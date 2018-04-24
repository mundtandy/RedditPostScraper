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

function parseJSON(jsOBJ, parsedFinal){
    var index = 1;
    var key = JSON.parse(loadVal('parseKey'));

    for(var i = 0; i < jsOBJ.data.dist; i++) {
        var postJSON = jsOBJ.data.children[i].data;
        var timeUTC = new Date(postJSON.created_utc * 1000);
        var temp = [];
        for (var j = 0; j <key.length; j++) {
            switch(key[j]){
                case '#':
                    temp.push(index++);
                    break;
                case 'Day':
                    temp.push(days[timeUTC.getDay()]);
                    break;
                case 'Date':
                    temp.push(`${timeUTC.getDate()}/${timeUTC.getMonth() + 1}/${timeUTC.getFullYear()}`);
                    break;
                case 'Hour':
                    temp.push(`${timeUTC.getHours()}:${timeUTC.getMinutes()}:${timeUTC.getSeconds()}`);
                    break;
                case 'Title':
                    temp.push(postJSON.title);
                    break;
                case 'Username':
                    temp.push(`=HYPERLINK("https://www.reddit.com/user/${postJSON.author}","${postJSON.author}")`);
                    break;
                case 'Tag':
                    temp.push(postJSON.link_flair_text);
                    break;
                case 'Points':
                    temp.push(postJSON.score);
                    break;
                case 'Comments':
                    temp.push(postJSON.num_comments);
                    break;
                case 'Link':
                    temp.push(`=HYPERLINK("https://www.reddit.com${postJSON.permalink}")`);
                    break;
                default:
                    temp.push("");
            }
        }
        parsedFinal.push(temp);
    }
    return parsedFinal;
}

function writeToFile(toWrite) {
    var wb = {SheetNames: ["Sheet1"], Sheets: {Sheet1: X.utils.aoa_to_sheet(toWrite)}};
    var toShow = X.utils.sheet_to_html(wb.Sheets[getSheet(wb.SheetNames)]);

    var x = window.open('results.html','_blank','resizable=no, width=800, height=600');
    x.onload = function() {
        this.document.getElementById('resultsTable').innerHTML = toShow.slice(toShow.search("<body><table>")+13 , toShow.search('</table></body>'));
        this.document.getElementById('resultText').innerHTML = localStorage.getItem('resultString');
        localStorage.removeItem('resultString');
    };
}
