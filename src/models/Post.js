const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        unique: [true, 'Title is taken please choose new'],
        type: String,
        required: true,
        minlength: [6, 'Title must be at least 6 characters'],
    },
    keyword: {
        type: String,
        required: true,
        minlength: [6, 'Title must be at least 6 characters'],
    },
    location: {
        type: String,
        required: true,
        maxlength: [10, 'Location must be no more than 10 characters']
    },
    date: {
        type: String,
        required: true,
        maxlength: [10, 'Date should be exactly 10 characters '],
        default: (new Date()).toDateString(),
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\//i.test(v);
            }
        }
    },
    description: {
        type: String,
        required: true,
        minlength: [8, 'Description must be at least 8 characters'],
        maxlength: 200
    },
    votes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true
    });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;