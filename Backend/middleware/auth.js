module.exports.isAuthenticated = (req, res, next) => {

    //work out if user is authenticated

    //if yes:
    //req.isAuthenticated = true;

    //if no:
    req.isAuthenticated = false;


    next()
}