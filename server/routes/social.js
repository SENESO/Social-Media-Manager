const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { TwitterApi } = require('twitter-api-v2');
const { FacebookApi } = require('facebook-nodejs-business-sdk');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Connect Twitter account
router.post('/connect/twitter', auth, async (req, res) => {
    try {
        const { accessToken, accessTokenSecret, username } = req.body;
        
        req.user.socialAccounts.twitter = {
            connected: true,
            accessToken,
            refreshToken: accessTokenSecret,
            username
        };
        
        await req.user.save();
        res.json({ message: 'Twitter account connected successfully' });
    } catch (err) {
        console.error('Error connecting Twitter account:', err);
        res.status(500).json({ message: 'Error connecting Twitter account' });
    }
});

// Connect Facebook account
router.post('/connect/facebook', auth, async (req, res) => {
    try {
        const { accessToken, userId, pageId } = req.body;
        
        req.user.socialAccounts.facebook = {
            connected: true,
            accessToken,
            userId,
            pageId
        };
        
        await req.user.save();
        res.json({ message: 'Facebook account connected successfully' });
    } catch (err) {
        console.error('Error connecting Facebook account:', err);
        res.status(500).json({ message: 'Error connecting Facebook account' });
    }
});

// Connect Instagram account
router.post('/connect/instagram', auth, async (req, res) => {
    try {
        const { accessToken, userId } = req.body;
        
        req.user.socialAccounts.instagram = {
            connected: true,
            accessToken,
            userId
        };
        
        await req.user.save();
        res.json({ message: 'Instagram account connected successfully' });
    } catch (err) {
        console.error('Error connecting Instagram account:', err);
        res.status(500).json({ message: 'Error connecting Instagram account' });
    }
});

// Connect LinkedIn account
router.post('/connect/linkedin', auth, async (req, res) => {
    try {
        const { accessToken, userId } = req.body;
        
        req.user.socialAccounts.linkedin = {
            connected: true,
            accessToken,
            userId
        };
        
        await req.user.save();
        res.json({ message: 'LinkedIn account connected successfully' });
    } catch (err) {
        console.error('Error connecting LinkedIn account:', err);
        res.status(500).json({ message: 'Error connecting LinkedIn account' });
    }
});

// Get connected accounts
router.get('/accounts', auth, async (req, res) => {
    try {
        const accounts = req.user.socialAccounts;
        res.json(accounts);
    } catch (err) {
        console.error('Error fetching social accounts:', err);
        res.status(500).json({ message: 'Error fetching social accounts' });
    }
});

// Disconnect social account
router.delete('/disconnect/:platform', auth, async (req, res) => {
    try {
        const { platform } = req.params;
        req.user.socialAccounts[platform] = {
            connected: false
        };
        await req.user.save();
        res.json({ message: `${platform} account disconnected successfully` });
    } catch (err) {
        console.error('Error disconnecting account:', err);
        res.status(500).json({ message: 'Error disconnecting account' });
    }
});

module.exports = router; 