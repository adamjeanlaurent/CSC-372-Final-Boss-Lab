/*
================================================================================================================================================================
IMPORTS
================================================================================================================================================================
*/

const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

const app = express();

/*
================================================================================================================================================================
CONFIGURATION
================================================================================================================================================================
*/

app.use(express.json());

app.use(session({ 
    secret: 'herhererherhe',
    resave: true,
    saveUninitialized: false,
 }));

const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const SERVER_PORT = process.env.DB_PORT || 3000;

const connection = mysql.createConnection({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
});

connection.connect(err => { console.log(err || 'connected to db 🤖') });

/*
================================================================================================================================================================
MIDDLEWARE
================================================================================================================================================================
*/

const protectedRoute = (req, res, next) => {
    const sessionID = req.session.id;

    // check if session ID is in DB
    connection.query('SELECT * FROM auth_lab WHERE sessionID = ?' , [sessionID], (errors, results, fields) => {
        if(error || results.length === 0) {
            // if user is not authetnicated they cannot access profile, send them to login
            return res.redirect('/login');
        }
        else {
            // if user is authenticated, send them to profile with correct profile information
            req.user = { name: results[0].name };
            next();
        }
    });
}

// middleware to check if user is already logged in
const isAuthenicated = (req, res, next) => {
    const sessionID = req.session.id;

    // check if session ID is in DB
    connection.query('SELECT * FROM auth_lab WHERE sessionID = ?' , [sessionID], (errors, results, fields) => {
        if(results.length > 0) {
            // if session exists, user is already authenticated, send them to profile
           return res.redirect('/profile');
        }
        else {
            // if session doesn't exist, user in not authenticated, it's okay for them to access register / login
            next();
        }
    });
}

/*
================================================================================================================================================================
ROUTES
================================================================================================================================================================
*/

app.post('/api/auth/logout', (req, res) => {
    const sessionID = req.session.id;

    // destory session and remove from DB
    req.session.destroy();

    connection.query('UPDATE auth_lab SET sessionID = NULL WHERE sessionID = ?', [sessionID], (errors, results, fields) => {
        return res.redirect('/login');
    });
});

app.post('/api/auth/register', (req, res) => {
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

app.post('/api/auth/login', (req, res) => {
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

app.listen(SERVER_PORT);