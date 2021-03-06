const detailsController = require('express').Router();
const postService = require('../services/post-service.js');
const { authorization, isOwn, hasVoted } = require('../middleWares/auth-middleware.js');

detailsController.get('/', async (req, res) => {
    try {
        const post = await postService.getAll();
        res.render('all-posts', { post });
    } catch (error) {
        console.log(error);
        res.render('all-posts', { error: error.message });
    }
});

detailsController.get('/:postId', async (req, res) => {
    try {
        const post = await postService.getOne(req.params.postId);
        const authorName = post.author.firstName + ' ' + post.author.lastName;
        const isOwn = post.author._id == req.user?._id;
        const hasVoted = post.votes.some(x => x._id == req.user?._id);
        const allVoters = post.votes.map(post => post.email).join(', ');
        res.render('details', { ...post, authorName, isOwn, hasVoted, allVoters, error: req.query.error });
    } catch (error) {
        console.log(error);
        res.render('details', { error: error.message });
    }
});

detailsController.get('/:postId/delete', authorization, isOwn, async (req, res) => {
    try {
        await postService.deletePost(req.params.postId);
        await postService.deletePostFromUserDoc(req.user._id, req.params.postId);
        res.redirect('/wildlife/details');
    } catch (error) {
        console.log(error);
        res.render('index', { error: error.message });
    }
});

detailsController.get('/:postId/edit', authorization, isOwn, async (req, res) => {
    try {
        const post = await postService.getOne(req.params.postId);
        res.render('edit', { ...post });
    } catch (error) {
        console.log(error);
        res.render('edit', { error: error.message });
    }
});

detailsController.post('/:postId/edit', authorization, isOwn, async (req, res) => {
    try {
        let { title, keyword, location, date, image, description } = req.body;
        let author = req.user._id;
        let editedPost = { title, keyword, location, date, image, description, author };
        await postService.updatePost(req.params.postId, editedPost);
        res.redirect(`/wildlife/details/${req.params.postId}`);
    } catch (error) {
        console.log(error);
        res.render('edit', { error: error.message });
    }
});

detailsController.get('/:postId/up-vote', authorization, hasVoted, async (req, res) => {
    try {
        await postService.upVotePost(req.params.postId, req.user._id);
        res.redirect(`/wildlife/details/${req.params.postId}`);
    } catch (error) {
        console.log(error);
        res.render('details', { error: error.message });
    }
});

detailsController.get('/:postId/down-vote', authorization, hasVoted, async (req, res) => {
    try {
        await postService.downVotePost(req.params.postId, req.user._id);
        res.redirect(`/wildlife/details/${req.params.postId}`);
    } catch (error) {
        console.log(error);
        res.render('details', { error: error.message });
    }
});

module.exports = detailsController;