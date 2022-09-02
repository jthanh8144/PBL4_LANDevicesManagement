const jwt = require('jsonwebtoken');

module.exports = {
    addTimer(res, id, time) {
        try {
            const data = jwt.sign({
                content: 'Máy sẽ tắt sau ' + time + ' phút kể từ ' + new Date().toLocaleString()
            }, global.keyCookie);
            res.cookie(id, data, { expires: new Date(Date.now() + 60000 * time) });
        } catch (error) {}
    },
    delTimer(res, id) {
        res.clearCookie(id);
    },
    getTimer(req, id) {
        let data;
        try {
            data = jwt.verify(req.cookies[id], global.keyCookie);
        } catch (error) {}
        return data;
    }
}
