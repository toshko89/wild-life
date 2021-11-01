const wildlifeController = require('express').Router();
const postService = require('../services/post-service.js');
const { authorization } = require('../middleWares/auth-middleware.js');
const detailsController = require('./detailsController.js');


wildlifeController.get('/create', authorization, (req, res) => {
    res.render('create', { title: 'Create new post' });
});

wildlifeController.post('/create', authorization, async (req, res) => {
    try {
        let { title, keyword, location, date, image, description } = req.body;
        let author = req.user._id;
        let newPost = { title, keyword, location, date, image, description, author };
        await postService.createPost(newPost);
        res.redirect('/wildlife/details');
    } catch (error) {
        console.log(error);
        res.render('create', { error: error.message });
    }
});

wildlifeController.use('/details', detailsController);

module.exports = wildlifeController;