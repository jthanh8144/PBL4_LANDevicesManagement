module.exports = function saveAccountLogged(req, res, next) {
    if (req.session.isAuthenticated === null) {
        req.session.isAuthenticated = false;
    }
    res.locals.localIsAuthenticated = req.session.isAuthenticated;
    res.locals.localAccountID = req.session.accountID;
    res.locals.localUsername = req.session.username;
    next();
};