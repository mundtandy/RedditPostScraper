try {

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

          //  alert(`${now.getHours()}:${now.getMinutes()}`);
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

//removes stored token information
function cullStorage(){
    localStorage.removeItem('rAccToken');
    localStorage.removeItem('rTokenOut');
    localStorage.removeItem('rRefToken');
}



    var showForPages = ["https://www.reddit.com/r/*"];
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// Set up the context menus
//parse url
    function parseUrl(url){
        var parsed = url.split("/");
        if(parsed.length < 7)
            alert('Please select a reddit post comment to parse');
        else {

            //get Using Tokens
            parseThing(parsed[4], parsed[6]);
        }
    }

    /*
     var url = https://oauth.reddit.com;


    */

//gets value stored in local Storage
    function loadVal(toLoad){
        var toReturn = localStorage.getItem(toLoad);

        return (toReturn === null? null : (toReturn));
    }

    function parseThing(subreddit, sort, num) {
        var tokenReq = new XMLHttpRequest();
        var base = `https://oauth.reddit.com/r/${subreddit}/${sort}?limit=100`;
        var token = loadVal('rAccToken');



        tokenReq.open('GET', base, true);

        tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        tokenReq.setRequestHeader('User-Agent', 'Reddit Post Scraper /u/thealus');
        tokenReq.setRequestHeader('Authorization', `bearer ${token}`);



        tokenReq.addEventListener('load', function(){
            //alert(tokenReq.status);
            var index = 0;
            if(tokenReq.status >= 200 && tokenReq.status < 400){
                var tokenJSON = JSON.parse(tokenReq.responseText);
                alert(tokenJSON.data.dist);
                var tempArr;
                var finalArr;
                for(var i = 0; i < tokenJSON.data.dist; i++) {
                    tempArry = [];
                    var postJSON = tokenJSON.data.children[0].data;

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

                }
                finalArr.push(tempArr);

                //parseToWS(finalArr);


            } else{
                alert(tokenReq.status+"\nNetwork error");
            }
        });
        tokenReq.send();
    }
} catch(err) {
    alert(err.message);
}
