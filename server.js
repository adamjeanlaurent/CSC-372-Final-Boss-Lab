const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

const authRoute = require('./routes/authRoute');

const SERVER_PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
 }));

app.use(morgan('dev'));
app.use(cors());

app.use('/api/auth', authRoute);

app.listen(SERVER_PORT);