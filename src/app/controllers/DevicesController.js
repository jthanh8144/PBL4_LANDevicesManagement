const delay = require('delay');
const mongoose = require('../../util/mongoose');

const Device = require('../models/Device');

class DevicesController {
    // [GET] /
    index(req, res, next) {
        Device.find({})
            .then(_devices => {
                res.render('devices/devices', {
                    title: 'Thiết bị',
                    isLoginPage: false,
                    haveChart: false,
                    styles: 'devices',
                    devices: 'active',
                    username: res.locals.localUsername,
                    message: {
                        status: req.query.status || '',
                        content: req.query.content ? String(req.query.content).replaceAll('-', ' ') : '',
                    },
                    _devices: mongoose.multipleMongooseToObject(_devices),
                });
            })
            .catch(next);
    }

    async detail(req, res, next) {
        Device.findOne({ _id: req.params.slug })
            .then(device => {
                res.render('devices/detail', {
                    title: 'Chi tiết',
                    isLoginPage: false,
                    haveChart: true,
                    styles: 'detail',
                    devices: 'active',
                    username: res.locals.localUsername,
                    message: {
                        status: req.query.status || '',
                        content: req.query.content ? String(req.query.content).replaceAll('-', ' ') : '',
                    },
                    device: mongoose.mongooseToObject(device),
                });
            })
            .catch(next);
        while (true) {
            Device.findOne({ _id: req.params.slug })
                .then(device => {
                    device = mongoose.mongooseToObject(device);
                    global.io.emit('data', {
                        data: {
                            id: req.params.slug,
                            cpuUsage: device.CPUUsage,
                            numProcess: device.numProcess,
                            numThread: device.numThread,
                            ramUsage: device.RAMUsage,
                            ramFree: parseFloat(device.RAMSize - device.RAMUsage).toFixed(1),
                            diskUsage: device.diskUsage,
                        },
                    });
                });
            await delay(2000);
            if (global.socketActive == false) {
                break;
            }
        }
    }

}

module.exports = new DevicesController();
