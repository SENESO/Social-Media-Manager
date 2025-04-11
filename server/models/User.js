const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    socialAccounts: {
        twitter: {
            connected: { type: Boolean, default: false },
            accessToken: String,
            refreshToken: String,
            username: String
        },
        facebook: {
            connected: { type: Boolean, default: false },
            accessToken: String,
            userId: String,
            pageId: String
        },
        instagram: {
            connected: { type: Boolean, default: false },
            accessToken: String,
            userId: String
        },
        linkedin: {
            connected: { type: Boolean, default: false },
            accessToken: String,
            userId: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema); 