require('dotenv').config();
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const db = require('./models/db');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const app = express();
app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    // cookie: {
    //         maxAge: 30 * 24 * 60 * 60 * 1000 
    // }
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

  passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    function(username, password, done) {
        console.log(`password: ${password} user: ${username}`)
      user.retreiveUser(username)
        .catch(error => {return done("no email")})
        .then(ourUser => {
           if (ourUser.status === "pending"){
            return done(`Please verify your account via email to login`);
           } else return ourUser
        })
        // .then(console.log)
        .then(ourUser => {
                    if (ourUser.passwordDoesMatch(password)) {
                        ourUser.updateUserActive()
                        .then(result => {return done(null, ourUser)})
                     } else {
                        return done(`incorrect password`);

                }
        })
    }
     ));
 
passport.use(new LinkedInStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress'],
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        user.checkUser(profile.emails[0].value)
        .then(result => {
            if (result === true){
                user.retreiveUser(profile.emails[0].value)
                .then(ourUser => {ourUser.updateUserActive();
                return ourUser
                })
                .then(ourUser => {return done(null, ourUser)})
            } else {
            user.create0AuthUser(profile.emails[0].value,accessToken)
            .then(ourUser => {return done(null, ourUser)})}})
    });
  }));



// models
const user = require('./models/user');

// views
const page = require('./views/page');
const signupForm = require('./views/signupForm');
const loginForm = require('./views/loginForm');

// our email service which uses a gmail account I created saved in .env
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAILPASS 
    }
  });

// protects the routes that need login to access by redericting to home if not logged in
function protectRoute(req, res, next) {
    let isLoggedIn = req.user ? true : false;
    if (isLoggedIn) {
        next();
    } else {
        res.redirect(`/`);
    }
}
// our check to see if user is logged in based on whether a session has been created
app.use((req, res, next) => {
    let isLoggedIn = req.user ? true : false;
    console.log(`On ${req.path}, is a user logged in? ${isLoggedIn}`);
    next();
});



// Routes
app.get('/', (req, res) => {
    res.send(page('Welcome! Please login or signup to continue',req.user));
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
            // if there is an error in validation we let the user know
            res.send(page(signupForm('email or password not valid')))
          }
    // if there are no errors in validation we check to see if the user has already been registered
    // returns boolean value which sends an error message if user exists or creates user and
    // send verification email
    user.checkUser(req.body.email)
        .then(result => {
            if(result){
            res.send(page(signupForm('email is already registered to an account'))) 
            } else {
            user.createUser(req.body.email, req.body.password)
                // creates our JSON token that is sent for email verification
                .then(newUser => {
                    jwt.sign(
                        {
                            user: newUser.email
                        },
                            process.env.JWTKEY,
                        {
                            expiresIn: '1d'
                        },(err,emailToken) => {
                            const url = `http://localhost:3000/confirmation/${emailToken}`;
                            transporter.sendMail({
                                to: req.body.email,
                                subject: "Confirm Email ✔",
                                html: `Please click this link to confirm email: <a href="${url}">${url}</a>`
                            });
                        }
                    )})
                        .then(res.send(page(loginForm(`Please verify your account via email to login`))))
                    }
        });

});

// route from confirmation email that updates the user's account from 'pending to 'verified'
app.get('/confirmation/:token',async (req,res) => {
    try {
       const decoded = jwt.verify(req.params.token,process.env.JWTKEY);
       await user.retreiveUser(decoded.user) 
                .then(user => {user.updateUserStatus('verified')})
                .then(res.send(page(loginForm('Account Verified, Please Login to Continue'))))
    } catch(e){
        console.log("error")
    }
})

app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: process.env.LINKEDIN_STATE  }),
  function(req, res){
  });

  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/passed',
    failureRedirect: '/login'
  }),(req,res) => {
        
  });
  

app.get('/login', (req, res) => {
    res.send(page(loginForm()));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/passed',
    failureRedirect: '/login'
  }),(req,res) => {
  });

  
// app.post('/login', (req, res) => {
//     // checks to see if user is registered
//     user.retreiveUser(req.body.email)
//         .catch(res.send(page(loginForm(`invalid email`))))
//         .then(theUser => {
//             // prevents login unless the user has verified account via email
//             if (theUser.status === 'pending'){
//                 res.send(page(loginForm(`Please verify your account via email to login`)))
//             } else return theUser
//         })
//     // Next - check if passwords match via bcrypt
//         .then(theUser => {
//             if (theUser.passwordDoesMatch(req.body.password)) {
//                 theUser.updateUserActive()
//                 req.session.user = theUser;
//                 req.session.save(function(err){  
//                 res.redirect('/passed');
//             })
//              } else {
//             res.send(page(loginForm(`incorrect email or password`)))
//         }
//     })
// });

app.get('/passed',protectRoute, (req, res) => {

    console.log(req.user.email)
    res.send(page(`the logged in user is: ${req.user.email}`,req.session));
});

app.post(`/logout`, (req, res) => {

    user.retreiveUser(req.user.email)
        .then(user => {
            user.updateUserNotActive()
        })
        .then(req.session.destroy(()=>{
            res.redirect(`/`); 
        }))
    
    // redirect them to homepage
});

app.listen(3000, () => {
    console.log('Express Ready')
});

// need to add a check for the email being wrong - done in model
// need to add email verification - done
// add timestamp for registration time 
// 0auth
// tape for testing