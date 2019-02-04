require('dotenv').config();
const user = require('./models/user');
const db = require('./models/db');


const express = require('express');
const app = express();



// user.createUser('new.com', 'testpassword')
user.retreiveUser('new.com')

app.listen(4000, () => {
    console.log('Express Ready')
});