class AboutController {
    // [GET] /about-contact
    index(req, res, next) {
        let content = false;
        let title = 'Liên hệ';
        if (req.query.content == 'about') {
            title = 'Giới thiệu';
            content = true;
        }
        res.render('about', {
            layout: false,
            title,
            content,
        });
    }
}

module.exports = new AboutController();
