//FIXME make this work lel

function tokenGet() {
	var tokenReq = new XMLHttpRequest();

    var base = "https://www.reddit.com/api/v1/access_token";
    var clientID = "ASDFASDFASDF";
    var secret = "ASDFASDFASDF";    

    //FIXME "grant_type=client_credentials";

    tokenReq.open("POST", base, true); 

    tokenReq.setRequestHeader("Authorization", "Basic " + btoa(clientID + ":" + secret));
    tokenReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

    tokenReq.addEventListener("load", function(){
        
        if(tokenReq.status >= 200 && tokenReq.status < 400){
            
           var response = JSON.parse(tokenReq.responseText);

           console.log(response);
        }

            else{

                console.log("Network error"); 
            }

        });//end load function

    tokenReq.send();
}