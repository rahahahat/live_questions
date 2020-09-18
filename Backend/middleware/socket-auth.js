var jwt = require('jsonwebtoken')

module.exports.socketIsAuthenticated = (socket, next) => {
    //console.log("AUTH CALLED");

    let cookies = socket.handshake.headers.cookie; //Get http cookies from the socket header

    if (!cookies) return next(new Error('Authentication error - No Cookie')) //error if there is no cookie

    let token = getCookie(cookies, 'token') //get token from the cookies

    if (token) { //if token exists

        //verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) return next(new Error('Authentication error - Bad Token'));
            socket.decodedToken = decodedToken;
            next();
        });
    } else {
        next(new Error('Authentication error - No Token'));
    }
}

/* 
socket.handshake.headers.cookie organises cookies the same way as document.cookie
so it follows the format: token=eyJhbGciOiJIUz....;anothercookie=1232sdfgsfgeaga
this function uses regex to extract cookies by name. 

For now we only have a token cookie but using this protexts us in case we have other cookies in the future
*/
function getCookie(cookielist, name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = cookielist.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}