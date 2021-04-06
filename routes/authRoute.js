const express = require('express');
const connection = require('../db/connection');
const { protectedRoute, isAuthenicated } = require('../middleware/middleware');

const router = express.router();

router.post('/logout', (req, res) => {
    const sessionID = req.session.id;

    // destory session and remove from DB
    req.session.destroy();

    connection.query('UPDATE auth_lab SET sessionID = NULL WHERE sessionID = ?', [sessionID], (errors, results, fields) => {
        return res.redirect('/login');
    });
});

router.post('/register', (req, res) => {
    const { name, username, password } = req.body;

    // check for errors
    let errors = [];
    if(name === '') errors.push('name cannot be blank!😡');
    if(username === '') errors.push('username cannot be blank!😡');
    if(password && username.length < 20) errors.push('username must be <= 20 characters!😡');
    if(password === '') errors.push('password cannot be blank!😡');

    // check if username exists
    connect.query('SELECT * auth_lab WHERE username = ?', [username], (error, results, fields) => {
        if(results.length > 0) {
            errors.push('username taken!😡');
        }
    });

    // send errors if any
    if(errors.length != 0) {
        return res.json({
            errors: errors
        });
    }

    // store data in DB
    connection.query('INSERT INTO auth_lab(username, name, password) VALUES(?, ?, ?)', [username, name, password], (error, results, fields) => {
        if(error) {
            errors.push(error);
            return res.json({
                errors: errors
            });
        }

        else {
            // if no errors, redirect to login page
            return res.redirect('/login');
        }
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // check for errors
    let errors = [];
    if(username === '') errors.push('username cannot be blank!😡');
    if(password === '') errors.push('password cannot be blank!😡');

    // check if username exists and password is taken
    connection.query('SELECT * FROM auth_lab WHERE username = ?', [username], (error, results, fields) => {
        if(results.length > 0) {
            errors.push('username does not exist!😡, how about registering?');
        }

        else {
            const dbPasword = results[0].password;
            if(password !== dbPasword) {
                errors.push('incorrect password!😡');
            }
            
            // set session data to persist id
            else {
                req.session.username = username;
            }
        }
    });

    // send errors if any
    if(errors.length != 0) {
        return res.json({
            errors: errors
        });
    }

    // set session in DB
    connection.query('UPDATE auth_lab SET sessionID = ? WHERE username = ?', [req.session.id, username], (error, results, fields) => {
        if(error) {
            errors.push(error);
            return res.json({
                errors: errors
            });
        }
    });

    return res.redirect('/profile');
});

module.exports = router;