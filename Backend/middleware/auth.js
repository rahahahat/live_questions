
var jwt = require('jsonwebtoken')

//work out if user is authenticated by token
module.exports.isAuthenticated = (req, res, next) => {
    // console.log(JSON.stringify(req.cookies));
    let token = req.cookies.token
    // console.log("-------------------------------------/n", token);
    if (token) {
        let verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("verfied", verified);
        req.isAuthenticated = verified;
    } else {
        req.isAuthenticated = false
    }
    next()
}