// import packages
const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');

const connect = require('./config/database');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cookieParser())
app.use(express.json());

// route import and mount
const user = require('./routes/user');
app.use('/api/v1',user);

// activating server
app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`)
})

// connecting with database
connect();