const delay = require('delay');
const mongoose = require('../../util/mongoose');
const Device = require('../models/Device');
const { exec } = require('child_process');

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

    // [GET] /:slug
    async detail(req, res, next) {
        var cpuActive = '';
        var moreActive = '';
        var cpuContent = '';
        var moreContent = '';
        if (req.query.activeTab == 'more') {
            moreActive = ' active';
            moreContent = ' show active';
        } else {
            cpuActive = ' active';
            cpuContent = ' show active';
        }
        Device.findOne({ _id: req.params.slug })
            .then(device => {
                res.render('devices/detail', {
                    title: 'Chi tiết',
                    isLoginPage: false,
                    haveChart: true,
                    styles: 'detail',
                    devices: 'active',
                    username: res.locals.localUsername,
                    cpuActive,
                    moreActive,
                    cpuContent,
                    moreContent,
                    message: {
                        status: req.query.status || '',
                        content: req.query.content ? String(req.query.content).replaceAll('-', ' ') : '',
                    },
                    device: mongoose.mongooseToObject(device),
                    moreStatus: req.session.moreInfo ? (req.session.moreInfo.moreId == req.params.slug ? req.session.moreInfo.moreStatus : '') : '',
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
                            gpuUsage: device.GPUUsage,
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

    // [POST] /:slug
    async timer(req, res, next) {
        console.log('timer\n');
        var time = parseInt(req.body.min) * 60;
        var query = 'net use \\' + req.query.name + ' /user:ADMIN tem1412; shutdown -s -m \\' + req.query.name + ' -t ' + time;
        console.log(query);
        exec(query, (error, stdout, stderr) => {
            if (error) {
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            if (stderr) {
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            req.session.moreInfo = {
                moreStatus: 'Máy sẽ tắt sau ' + req.body.min + ' phút kể từ ' + new Date().toLocaleString(),
                moreId: req.params.slug,
            };
            res.redirect(`/devices/${req.params.slug}/?status=alert-success&content=Hẹn-giờ-tắt-máy-thành-công&activeTab=more`);
        });
    }

    // [POST] /cancel/:slug
    async cancelTimer(req, res, next) {
        console.log('cancel\n');
        var query = 'net use \\' + req.query.name + ' /user:ADMIN tem1412; shutdown -a -m \\' + req.query.name;
        console.log(query);
        exec(query, (error, stdout, stderr) => {
            if (error) {
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            if (stderr) {
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            req.session.moreInfo = null;
            res.redirect(`/devices/${req.params.slug}/?status=alert-success&content=Hủy-hẹn-giờ-tắt-máy-thành-công&activeTab=more`);
        });
    }
}

module.exports = new DevicesController();
