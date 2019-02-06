require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const db = require('./models/db');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAILPASS // generated ethereal password
    }
  });

//   console.log("Message sent: %s", info.messageId);

app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: 'abc123kasfsdbukbfrkqwuehnfioaebgfskdfhgcniw3y4fto7scdghlusdhbv',
    saveUninitialized: false,
    cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));
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

function protectRoute(req, res, next) {
    let isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        next();
    } else {
        res.redirect(`/`);
    }
}
// middleware
app.use((req, res, next) => {
    let isLoggedIn = req.session.user ? true : false;
    // console.log(req.session.user);
    console.log(`On ${req.path}, is a user logged in? ${isLoggedIn}`);
    // We call the next function
    next();
});


app.get('/', (req, res) => {
    const thePage = page('Welcome! Please login or signup to continue');
    res.send(thePage);
}); 

app.get('/signup', (req, res) => {
    res.send(page(signupForm()));
});
app.post('/signup',[
    // validating input with express validator
    check('email').isEmail(),
    check('password').isLength({min : 8})
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send(page(signupForm('email or password not valid')))
            // console.log( res.status(422).json({ errors: errors.array() }));
          }
            //   check to see if email is already registered if so redirect to register with error message
            //   or create account 

    user.checkUser(req.body.email)
        .then(result => {
            result ? res.send(page(signupForm('email is already registered to an account'))) 
            : user.createUser(req.body.email, req.body.password)
                .then(newUser => {jwt.sign(
                    {
                        user: newUser.email
                    },
                    // need to update this secret
                    'EMAIL_SECRET',
                    {
                        expiresIn: '1d'
                    },(err,emailToken) => {
                        const url = `http://localhost:3000/confirmation/${emailToken}`;
                        transporter.sendMail({
                            to: "carlos.a.rodriguez100@gmail.com", // list of receivers
                            subject: "Confirm Email ✔", // Subject line
                            html: `Please click this link to confirm email: <a href="${url}">${url}</a>` // html body
                          });
                
                    }
                )})
                .then(res.send(page(loginForm(`Please verify your account via email to login`))))

            });

});

app.get('/confirmation/:token',async (req,res) => {
    try {
       const decoded = jwt.verify(req.params.token,'EMAIL_SECRET');
       await user.retreiveUser(decoded.user) 
                .then(user => {user.updateUserStatus('confirmed')})
    } catch(e){
        console.log("error")
    }
})

app.get('/login', (req, res) => {
    res.send(page(loginForm()));
});

app.post('/login', (req, res) => {
    user.retreiveUser(req.body.email)
        .then(theUser => {
            // checks to see if user is registered
            if (theUser.status === 'pending'){
                res.send(page(loginForm(`Please verify your account via email to login`)))
            } else return theUser
        })
    // Next - check if passwords match via bcrypt
        .then(theUser => {
            if (theUser.passwordDoesMatch(req.body.password)) {
               req.session.user = theUser;
                req.session.save(function(err){  
                res.redirect('/passed');
            })
             } else {
            res.send(page(loginForm(`incorrect email or password`)))
        }
    })
});

app.get('/passed', protectRoute, (req, res) => {
    res.send(page(`the logged in user is: ${req.session.user.email}`,req.session.user));
});

app.post(`/logout`, (req, res) => {
    // kill the session
    req.session.destroy(()=>{
        res.redirect(`/`); 
    });
    // redirect them to homepage
});

app.listen(3000, () => {
    console.log('Express Ready')
});



// need to add a check for the email being wrong - done in model
// need to add email verification
// 0auth
// timestamps