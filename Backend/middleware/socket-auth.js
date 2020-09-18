var jwt = require('jsonwebtoken')

module.exports.socketIsAuthenticated = (socket, next) => {
    console.log("AUTH CALLED");
    let cookies = socket.handshake.headers.cookie;

    let token = getCookie(cookies, 'token')

    if (token) { //if token exists
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) return next(new Error('Authentication error'));
            socket.decodedToken = decodedToken;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}

function getCookie(cookielist, name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = cookielist.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}