const homeController = require('express').Router();
const { authorization } = require('../middleWares/auth-middleware.js');

const postService = require('../services/post-service.js');
// const { authorization } = require('../middleWares/auth-middleware.js')

//TODO
homeController.get('/', (req, res) => {
    try {
        // const houses = await houseService.getLatestThree();
        res.render('home');
    } catch (error) {
        console.log(error);
        // res.render('home', { error: error.message });
    }
});
//TODO
homeController.get('/profile', authorization, async (req, res) => {
    const post = await postService.getAllPerUser(req.user._id);
    console.log(post);
    res.render('my-posts');
});

module.exports = homeController;