const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DeviceSchema = new Schema({
    computerName: { type: String, required: true },
    GPUName: { type: String, required: true },
    numberOfLogicalProcessors: { type: String, required: true },
    chipset: { type: String, required: true },
    RAMSize: { type: String, required: true },
    IPAddress: { type: String, required: true },
    MACAddress: { type: String, required: true },
    MACAddress: { type: String, required: true, unique: true },
    CPUUsage: { type: String, required: true },
    numThread: { type: String, required: true },
    numProcess: { type: String, required: true },
    diskUsage: { type: String, required: true },
    RAMUsage: { type: String, required: true },
    GPUUsage: { type: String },
    activeTime: { type: String, required: true },
    isOnline: { type: Boolean, required: true },
});

module.exports = mongoose.model('Device', DeviceSchema);