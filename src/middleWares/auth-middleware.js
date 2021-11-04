const authService = require("../services/auth-service.js");
const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('../config/config.json');
const postService = require('../services/post-service.js');

function authentication(req, res, next) {
    const token = req.cookies[TOKEN_COOKIE_NAME];

    if (!token) {
        return next();
    }

    const tokenVerify = authService.verifyToken(token, JWT_SECRET);

    if (!tokenVerify) {
        res.render('login', { error: 'You are not authorized to view this page, please login/regiter' });
        return next()
    }
    //Only if userName is needed otherwise remove!!!
    const user = {
        _id: tokenVerify._id,
        email: tokenVerify.email,
        userName: tokenVerify.userName
    }

    req.user = user;
    res.locals.user = user;
    next();
}

function authorization(req, res, next) {

    if (!req.user) {
        return res.render('login', { error: 'You are not authorized to view this page, please login/regiter' });
    }
    next();

};

async function isOwn(req, res, next) {
    try {
        const post = await postService.getOne(req.params.postId);
        if (post.author._id == req.user?._id) {
            req.user.isOwn = true;
            return next();
        }
        return res.render('login', { error: 'You are not authorized to view this page, please login/regiter' });
    } catch (error) {
        return res.render('login', { error: error.message })
    }
}

async function hasVoted(req, res, next) {
    try {
        const post = await postService.getOne(req.params.postId);
        const hasVoted = post.votes.some(x => x._id == req.user?._id);
        if (hasVoted) {
            return res.redirect(`/wildlife/details/${req.params.postId}?error=You have already voted for this post`);
        }
        next();
    } catch (error) {
        return res.render('home', { error: error.message })
    }
}
module.exports = { authentication, authorization, isOwn, hasVoted }