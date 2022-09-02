const Device = require("../models/Device");
const mongoose = require('../../util/mongoose');

class DashboardController {
    // [GET] /dashboard
    index(req, res, next) {
        Device.find({})
            .then(devices => {
                devices = mongoose.multipleMongooseToObject(devices);
                let countActive = 0;
                let countTime = 0;
                devices.forEach(device => {
                    if (device.isOnline == true) {
                        countActive++;
                    }
                    countTime += device.activeTime;
                });

                res.render('dashboard', {
                    title: 'Trang chủ',
                    isLoginPage: false,
                    haveChart: true,
                    styles: 'dashboard',
                    dashboard: 'active',
                    username: res.locals.localUsername,
                    data: {
                        percent: parseInt(countActive / devices.length * 100),
                        hour: Math.floor(countTime / 3600),
                        min: Math.floor(countTime % 3600 / 60),
                        second: Math.floor(countTime % 3600 % 60),
                    },
                });

            })
            .catch(next);
    }
}

module.exports = new DashboardController();
