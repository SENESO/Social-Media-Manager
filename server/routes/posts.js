const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { TwitterApi } = require('twitter-api-v2');
const { FacebookApi } = require('facebook-nodejs-business-sdk');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, platforms } = req.body;

    const newPost = new Post({
      content,
      platforms,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Make sure user owns post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Publish post to social media platforms
router.post('/:id/publish', auth, async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const results = [];
        
        // Publish to Twitter
        if (post.platforms.includes('twitter') && req.user.socialAccounts.twitter.connected) {
            const twitterClient = new TwitterApi({
                appKey: process.env.TWITTER_API_KEY,
                appSecret: process.env.TWITTER_API_SECRET,
                accessToken: req.user.socialAccounts.twitter.accessToken,
                accessSecret: req.user.socialAccounts.twitter.refreshToken,
            });
            
            const tweet = await twitterClient.v2.tweet(post.content);
            results.push({ platform: 'twitter', success: true, id: tweet.data.id });
        }
        
        // Publish to Facebook
        if (post.platforms.includes('facebook') && req.user.socialAccounts.facebook.connected) {
            const fb = new FacebookApi(req.user.socialAccounts.facebook.accessToken);
            const response = await fb.api(`/${req.user.socialAccounts.facebook.pageId}/feed`, 'POST', {
                message: post.content
            });
            results.push({ platform: 'facebook', success: true, id: response.id });
        }
        
        // Update post status
        post.status = 'published';
        post.publishedAt = new Date();
        await post.save();
        
        res.json({ message: 'Post published successfully', results });
    } catch (err) {
        console.error('Error publishing post:', err);
        res.status(500).json({ message: 'Error publishing post' });
    }
});

module.exports = router; 