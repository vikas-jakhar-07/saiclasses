const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    siteTitle: {
        type: String,
        default: 'SailCasses Academy'
    },
    siteDescription: {
        type: String,
        default: 'Quality education for everyone'
    },
    primaryColor: {
        type: String,
        default: '#3B82F6'
    },
    secondaryColor: {
        type: String,
        default: '#1E40AF'
    },
    logo: {
        type: String
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', SettingSchema);