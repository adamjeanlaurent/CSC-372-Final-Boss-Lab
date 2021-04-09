const express = require('express');
const { protectedRoute, isAuthenicated } = require('../middleware/middleware');

const router = express.Router();

router.get('/register', isAuthenicated, (req, res) => {
    return res.render('register');
});

router.get('/login', isAuthenicated, (req, res) => {
    return res.render('login');
});

router.get('/profile', protectedRoute, (req, res) => {
    return res.render('register');
});

module.exports = router;