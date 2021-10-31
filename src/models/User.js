const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const _SALT = 10;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'First Name must be at least 3 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]+?$/i.test(v);
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        minlength: [5, 'Last Name must be at least 5 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]+?$/i.test(v);
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /(?!.*\.\.)(^[^\.][^@\s]+@[^@\s]+\.[^@\s\.]+$)/i.test(v);
            }
        },
        unique: [true,'Email is taken please choose different one']
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Your password should be at least 4 characters'],
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, _SALT)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

userSchema.static('findUser',function(email){
    return this.findOne({email}).lean();
});

const User = mongoose.model('User',userSchema);

module.exports = User;