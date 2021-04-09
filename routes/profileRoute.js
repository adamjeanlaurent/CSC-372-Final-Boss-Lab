const express = require('express');
const connection = require('../db/connection');

const router = express.Router();

router.get('/getName', (req, res, next) => {
    try {
        let errors = [];
        const sessionID = req.session.id;
        connection.query('SELECT * FROM auth_lab WHERE sessionID = ?', [sessionID], (error, results, fields) => {
            if(error) {
                errors.push('internal error');
                return res.json({   
                    errors: errors
                });
            }
            else {
                return res.json({
                    name: results[0].name
                });
            }
        });
    }

    catch(e) {
        return next();
    }
});

module.exports = router;