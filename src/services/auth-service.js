const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const config = require('../config/config.json')

const addUser = (firstName, lastName, email, password) => User.create({ firstName, lastName, email, password });

async function login(email, password) {
    const user = await User.findUser(email);

    if (!user) {
        throw new Error('Wrong username or password');
    }

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) {
        throw new Error('Wrong username or password');
    }

    return createToken(user);
}

function createToken(user) {
    const token = jwt.sign({ _id: user._id, email: user.email }, config.JWT_SECRET, { expiresIn: '2d' });
    return token;
};

function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

const authService = {
    addUser,
    login,
    createToken,
    verifyToken
}

module.exports = authService;