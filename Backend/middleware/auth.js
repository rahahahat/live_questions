
var jwt = require('jsonwebtoken')

//work out if user is authenticated by token
module.exports.isAuthenticated = (req, res, next) => {
    let room = req.body.url
    let token = req.cookies.token

    if (token) { //if a token exists

        //Check that the client has a valid access token
        let verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //Check that the room the token is for is the same as the room that is being accessed
        if (verified.room == room) {
            req.isAuthenticated = verified;
        } else {
            //console.log("Auth failed - wrong room");
            req.isAuthenticated = false;
        }
    } else {
        req.isAuthenticated = false
    }

    next()
}