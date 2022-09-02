const jwt = require('jsonwebtoken');

module.exports = {
    isLogged(req, res, next) {
        try {
            const data = jwt.verify(req.cookies.data, global.keyCookie);
            if (data !== undefined) {
                return res.redirect('/dashboard');
            }
        } catch (error) {}
        next();
    },
    isNotLogged(req, res, next) {
        try {
            const data = jwt.verify(req.cookies.data, global.keyCookie);
            if (data === undefined) {
                return res.redirect('/');
            }
        } catch (error) {}
        next();
    },
    clearCacheBack(req, res, next) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    },
};
