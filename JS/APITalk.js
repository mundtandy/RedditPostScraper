try {
    var X = XLSX;

    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

//submit login details
function tokenClick() {
    if (loadVal('rTokenStatus') === '0') { //if first time
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var curUrl = (tabs[0].url).toString();
            var index = (curUrl).search('&code=');
            if(index == -1)
                alert('Please re-authorise, and attempt again after being redirected');
            else {
                var authCode = curUrl.slice(index+6);
                //alert(authCode);
                tokenGet(authCode, true);
            }
        });
    } else { //if only need to get refresh token
        tokenGet('', false);
    }
}

//var returned = thing{
//	"access_token": "46LU7sVxIuAmP14uQPBLwu05dqc",
//	"token_type": "bearer",
//	"expires_in": 3600,
//	"refresh_token": "19684574-MbZDnv-WYQf8K_tHaurp8YOTXA4",
//	"scope": "read"
//	}
function tokenGet(authCode, newToken) {
    var tokenReq = new XMLHttpRequest();

    var base = 'https://www.reddit.com/api/v1/access_token';
    var clientID = client.client_id;
    var secret = client.secret;
    var refToken = loadVal('rRefToken');

    var postData = (newToken ? `grant_type=authorization_code&code=${authCode}&redirect_uri=${client.redirect_uri}` : `grant_type=refresh_token&refresh_token=${refToken}`);

    //alert(postData);

    tokenReq.open('POST', base, true);

    tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    tokenReq.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secret));

    tokenReq.addEventListener('load', function(){
        //	alert(tokenReq.status);
        if(tokenReq.status >= 200 && tokenReq.status < 400){
            var tokenJSON = JSON.parse(tokenReq.responseText);

            var now = new Date();
            now.setTime(now.getTime() + (60*60*1000));

            localStorage.setItem('rTokenStatus', '1');
            localStorage.setItem('rAccToken', tokenJSON.access_token);

            var curTime = now.toString();
            localStorage.setItem('rTokenOut', curTime);
            setText('currentToken', `Token expires: ${now.getHours()}:${now.getMinutes()}`, false);

            if(newToken){
                localStorage.setItem('rRefToken', tokenJSON.refresh_token);
            }

            alert('Token received!');

        } else{
            alert("Network error");
        }
    });
    tokenReq.send(postData);
}

//authenticate user
function authoriseClick() {
    localStorage.setItem('rTokenStatus', '0');
    cullStorage();

    var author = `https://www.reddit.com/api/v1/authorize?`
        +`client_id=${client.client_id}&response_type=${client.response_type}`
        +`&state=${client.state}&redirect_uri=${client.redirect_uri}`
        +`&duration=${client.duration}&scope=${client.scope}`

    chrome.tabs.create({
        url: author
    });
}

    //TODO:
        //https://loading.io/progress/ check out for fun loading bar
        //each completion of loop add num/1000 to 'loaded val'

    function parseThing(subreddit, sort, num, from, nsfw) {
        var index = num;
        var toWrite = [];
        var after;

        while(index > 0) {

            var numToSearch = (index >= 100 ? 100 : index % 100);

            //API Search
            var tokenReq = new XMLHttpRequest();
            var base = `https://oauth.reddit.com/r/${subreddit}/${sort}?limit=${numToSearch}&t=${from}`
                +(nsfw ? `&include_over_18=on` : ``)
                +(after === undefined ? `` : `&after=${after}`);
            var token = loadVal('rAccToken');
      tokenReq.open('GET', base, false); //false to force NOT ASYNC

            tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            tokenReq.setRequestHeader('User-Agent', 'Reddit Post Scraper /u/thealus');
            tokenReq.setRequestHeader('Authorization', `bearer ${token}`);

            tokenReq.addEventListener('load', function () {
                if (tokenReq.status >= 200 && tokenReq.status < 400) {
                    var postsJSON = JSON.parse(tokenReq.responseText);
                    parseJSON(postsJSON, toWrite);
                    after = postsJSON.data.after;

                } else {
                    alert(tokenReq.status + "\nNetwork error");
                }
            });
            tokenReq.send();

            index -= 100;
        }
        return toWrite;
    }
} catch(err) {
    alert(err.message);
}

//removes stored token information
function cullStorage(){
    localStorage.removeItem('rAccToken');
    localStorage.removeItem('rTokenOut');
    localStorage.removeItem('rRefToken');
}