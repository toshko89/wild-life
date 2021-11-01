const Post = require('../models/Post.js');
const User = require('../models/User.js')

const getAll = async () => Post.find().populate('votes').populate('author').lean();

const getAllPerUser = async (userId) => User.findById(userId).populate('posts').lean();

const getOne = async (postId) => Post.findById(postId).populate('votes').populate('author').lean();

const createPost = async (newPost) => Post.create(newPost)
    .then(function (post) {
        return User.findByIdAndUpdate({ _id: post.author._id }, { $push: { posts: post._id } })
    });

const deletePost = async (postId) => Post.findByIdAndDelete(postId)
    .then((postData) => User.findByIdAndUpdate({ _id: postData.author }, { $pull: { posts: postData._id } }));

const search = async (search) => Post.find({ type: { $regex: search, $options: 'i' } }).lean();

const updatePost = async (postId, newData) => Post.findByIdAndUpdate(postId, newData, { runValidators: true });


const addTenant = async (houseId, personId) =>
    Post.findByIdAndUpdate(
        { _id: houseId },
        {
            $push: { tenants: personId },
            $inc: { availablePieces: -1 }
        },
        { runValidators: true }
    )


const houseSerice = {
    getAll,
    getOne,
    search,
    addTenant,
    createPost,
    updatePost,
    deletePost,
    getAllPerUser,
}

module.exports = houseSerice;