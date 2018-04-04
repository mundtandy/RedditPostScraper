
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