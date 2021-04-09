const express = require('express');
const { protectedRoute, isAuthenicated } = require('../middleware/middleware');

const router = express.Router();

router.get('/', isAuthenicated, (req, res) => {
    return res.redirect('/register');
});

router.get('/register', isAuthenicated, (req, res) => {
    return res.render('register', { title: 'register' });
});

router.get('/login', isAuthenicated, (req, res) => {
    return res.render('login', { title: 'login' });
});

router.get('/profile', protectedRoute, (req, res) => {
    return res.render('profile', { title: 'profile' });
});

module.exports = router;