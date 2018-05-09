var modal = document.getElementById('simpleModal2');

document.getElementById('closeCopyBtn').addEventListener('click', closeError);
document.getElementById('toClipBoard').addEventListener("click", copyFunc);

function copyFunc() {
    var table = document.getElementById('resultsTable')
    //alert("clicked");
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(table);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(table);
            sel.addRange(range);
        }
        document.execCommand("copy");

    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(table);
        range.select();
        range.execCommand("Copy");
    }
    sel.removeAllRanges();
    showError('Results sent to Clipboard');
};

//Helper Function to set text
function setText(ele, toChange){
    document.getElementById(ele).innerHTML = toChange;
}

//show error text in modal
function showError(textVal){
    setText('errorText2', textVal);
    modal.style.display = 'block';
}

function closeError() {
    setText('errorText2', '', false);
    modal.style.display = 'none';
}
