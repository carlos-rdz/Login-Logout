require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db');

app.use(express.static('public'));
// Configure body-parser to read data sent by HTML form tags
app.use(bodyParser.urlencoded({ extended: false }));
// Configure body-parser to read JSON bodies
app.use(bodyParser.json());

// models
const user = require('./models/user');

// views
const page = require('./views/page');
const signupForm = require('./views/signupForm');
const loginForm = require('./views/loginForm');

// testing area

// user.checkUser(`carlos3@test.com`)




app.get('/', (req, res) => {
    const thePage = page('Welcome! Please login or signup to continue');
    res.send(thePage);
}); 

app.get('/signup', (req, res) => {
    res.send(page(signupForm()));
});
app.post('/signup', (req, res) => {

    user.checkUser(req.body.email)
        .then(result => {
            result ? res.send(page('email is already registered to an account')) 
            : user.createUser(req.body.email, req.body.password)})

});

app.get('/login', (req, res) => {
    res.send(page(loginForm()));
});

app.post('/login', (req, res) => {
    user.retreiveUser(req.body.email)
        // Check if passwords match via bcrypt
        .then(theUser => {
            if (theUser.passwordDoesMatch(req.body.password)) {
                    res.send(page("login succesful"))
                } else {
                    res.send(page(`incorrect email or password`))
            }
        });
    });



app.listen(3000, () => {
    console.log('Express Ready')
});