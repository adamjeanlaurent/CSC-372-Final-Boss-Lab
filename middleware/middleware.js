const connection = require('../db/connection');

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

module.exports = {
    protectedRoute: protectedRoute,
    isAuthenicated: isAuthenicated
};