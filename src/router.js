const router = require('express').Router()
const authController = require('./controllers/auth-controller.js');
const homeController = require('./controllers/home-controller.js');
const wildlifeController = require('./controllers/wildlife-controler.js');

router.use(homeController);
router.use(authController);
router.use('/wildlife', wildlifeController);
router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;