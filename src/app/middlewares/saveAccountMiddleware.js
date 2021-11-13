const jwt = require('jsonwebtoken');

module.exports = function saveAccountLogged(req, res, next) {
    req.session.moreInfo = []; 
    try {
        var data = jwt.verify(req.cookies.data, 'hana');
    } catch (error) {}
    if (data === undefined) {
        res.locals.localIsAuthenticated = false;
    } else {
        res.locals.localIsAuthenticated = data.isAuthenticated;
        res.locals.localAccountID = data.accountID;
        res.locals.localUsername = data.username;
    }
    next();
};