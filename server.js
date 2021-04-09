const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const exphbs = require('express-handlebars');

const authRoute = require('./routes/authRoute');
const pageRoute = require('./routes/pageRoute');
const profileRoute = require('./routes/profileRoute')

const SERVER_PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
 }));

app.use(morgan('dev'));
app.use(cors());

// error handler
app.use((error, req, res, next) => {
    res.status(500);
    if(process.env.NODE_ENV === 'production') {
        return res.json({
            error: 'Internal Error Occured🥞'
        });
    }
    
    return res.json({
        error: error.stack
    });
});

app.use('/', pageRoute);
app.use('/api/auth', authRoute);
app.use('/api/prfole', profileRoute);

app.listen(SERVER_PORT);