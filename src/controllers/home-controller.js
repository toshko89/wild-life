const homeController = require('express').Router();
const { authorization } = require('../middleWares/auth-middleware.js');
const postService = require('../services/post-service.js');

homeController.get('/', (req, res) => {
    res.render('home');
});

homeController.get('/profile', authorization, async (req, res) => {
    const post = await postService.getAllPerUser(req.user._id);
    res.render('my-posts', { post });
});

module.exports = homeController;