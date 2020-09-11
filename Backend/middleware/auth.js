
var jwt = require('jsonwebtoken')

//work out if user is authenticated by token
module.exports.isAuthenticated = (req, res, next) => {

    // let data = req.body;

    // let token = data.token

    // let verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.isAuthenticated = false// verified;

    //now in the routes we can use req.isAuthenticated to check if the user is authenticated

    next()
}