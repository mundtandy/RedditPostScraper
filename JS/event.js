document.getElementById('toClipBoard').addEventListener("click", function() {
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
    alert('Results sent to Clipboard');
});