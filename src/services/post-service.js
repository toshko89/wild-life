const Post = require('../models/Post.js');
const User = require('../models/User.js')

const getAll = async () => Post.find().populate('votes').populate('author').lean();

const getOne = async (postId) => Post.findById(postId).populate('votes').populate('author').lean();

const getAllPerUser = async (authorId) => Post.find({ author: authorId }).populate('votes').populate('author').lean();

const createPost = async (newPost) => Post.create(newPost)
    .then((post) => User.findByIdAndUpdate({ _id: post.author._id }, { $push: { posts: post._id } }))
    .catch((error)=>{
        return error;
    })

const deletePost = async (postId) => Post.findByIdAndDelete(postId)
    .then((post) => User.findByIdAndUpdate({ _id: post.author }, { $pull: { posts: post._id } }))
    .catch((error)=>{
        return error;
    });

const updatePost = async (postId, newData) => Post.findByIdAndUpdate(postId, newData, { runValidators: true });

const upVotePost = async (postId, userId) =>
    Post.findByIdAndUpdate(
        { _id: postId },
        {
            $push: { votes: userId },
            $inc: { rating: +1 }
        },
        { runValidators: true }
    )

const downVotePost = async (postId, userId) =>
    Post.findByIdAndUpdate(
        { _id: postId },
        {
            $push: { votes: userId },
            $inc: { rating: -1 }
        },
        { runValidators: true }
    )

const postService = {
    getAll,
    getOne,
    upVotePost,
    downVotePost,
    createPost,
    updatePost,
    deletePost,
    getAllPerUser
}

module.exports = postService;