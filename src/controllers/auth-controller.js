const authController = require('express').Router();

const config = require('../config/config.json')
const User = require('../models/User.js');
const authService = require('../services/auth-service.js');

authController.get('/login', (req, res) => {
    res.render('login')
});

authController.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let userToken = await authService.login(email, password);
        res.cookie(config.TOKEN_COOKIE_NAME, userToken, { httpOnly: true });
        res.redirect('/')

    } catch (error) {
        console.log(error);
        res.render('login', { error: error.message });
    }
});

authController.get('/register', (req, res) => {
    res.render('register');
});

authController.post('/register', async (req, res) => {
    try {
        let { firstName, lastName, email, password, repeatPassword } = req.body;
        if (password !== repeatPassword) {
            throw new Error('Password doesn\'t match, please try again');
        }
        if (firstName.trim() == '' || lastName.trim() == '' || email.trim() == '' || password.trim() == '') {
            throw new Error('All fields are required!');
        }

        const userCheck = await User.findUser(email);
        if (userCheck) {
            throw new Error('Username is taken, please try again')
        }

        const user = await authService.addUser(firstName, lastName, email, password);
        const token = authService.createToken(user);
        res.cookie(config.TOKEN_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.render('register', { error: error.message });
    }

});

authController.get('/logout', (req, res) => {
    res.clearCookie(config.TOKEN_COOKIE_NAME);
    res.redirect('/');
})

module.exports = authController;