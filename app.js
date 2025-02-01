const express = require('express');
require('dotenv').config({path: "config/config.env"});
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());



// Server routes
app.use('/api/user', require('./routes/user'));
app.use('/api/post', require('./routes/post'));
app.use('/api/story', require('./routes/story'));
app.use('/api/password', require('./routes/resetpass'));


module.exports = app; 