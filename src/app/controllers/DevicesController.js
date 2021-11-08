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
            // console.log(global.socketActive);
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
                            gpuUsage: device.GPUUsage,
                        },
                    });
                });
            await delay(2000);
            if (global.socketActive == false) {
                // console.log(global.socketActive, ' ', req.params.slug);
                return;
            }
        }
    }

    // [POST] /:slug
    async timer(req, res, next) {
        var time = parseInt(req.body.min) * 60;
        var q1 = 'NET USE \\\\' + req.query.name + ' /user:ADMIN tem1412';
        var q2 = 'shutdown -s -m \\\\' + req.query.name + ' -t ' + time;
        exec(q1, (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1.message);
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            if (stderr1) {
                console.log(stderr1);
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            exec(q2, (err2, stdout2, stderr2) => {
                if (err2) {
                    console.log(err2.message);
                    res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                    return;
                }
                if (stderr2) {
                    console.log(stderr2);
                    res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                    return;
                }
                req.session.moreInfo = {
                    moreStatus: 'Máy sẽ tắt sau ' + req.body.min + ' phút kể từ ' + new Date().toLocaleString(),
                    moreId: req.params.slug,
                };
                res.redirect(`/devices/${req.params.slug}/?status=alert-success&content=Hẹn-giờ-tắt-máy-thành-công&activeTab=more`);
            });
        });
    }

    // [POST] /cancel/:slug
    async cancelTimer(req, res, next) {
        var q1 = 'NET USE \\\\' + req.query.name + ' /user:ADMIN tem1412';
        var q2 = 'shutdown -a -m \\\\' + req.query.name;
        exec(q1, (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1.message);
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            if (stderr1) {
                console.log(stderr1);
                res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                return;
            }
            exec(q2, (err2, stdout2, stderr2) => {
                if (err2) {
                    console.log(err2.message);
                    res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                    return;
                }
                if (stderr2) {
                    console.log(stderr2);
                    res.redirect(`/devices/${req.params.slug}/?status=alert-danger&content=Có-lỗi-xảy-ra-vui-lòng-thử-lại&activeTab=more`);
                    return;
                }
                req.session.moreInfo = null;
                res.redirect(`/devices/${req.params.slug}/?status=alert-success&content=Hủy-hẹn-giờ-tắt-máy-thành-công&activeTab=more`);
            });
        });
    }
}

module.exports = new DevicesController();
