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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const flash = require('connect-flash');
const app = express();
app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Local Authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    function(username, password, done) {
        user.retreiveUser(username)
            .catch(error => {return done(null,false,{message:"no email"})})
            .then(ourUser => {
                if (ourUser.status === "pending"){
                    return done(null,false,`Please verify your account via email to login`);
                } else return ourUser
            })
            .then(ourUser => {
                if (ourUser.passwordDoesMatch(password)) {
                    ourUser.updateUserActive()
                        .then(result => {return done(null, ourUser)})
                } else {
                    return done(null,false,`incorrect password`);
                }
            })
    }
));
// Linkedin Authentication
passport.use(new LinkedInStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress'],
  }, 
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            user.checkUser(profile.emails[0].value)
                .then(result => {
                    if (result === true){
                        user.retreiveUser(profile.emails[0].value)
                            .then(ourUser => {
                                ourUser.updateUserActive();
                                return ourUser
                            })
                                .then(ourUser => {return done(null, ourUser)})
                    } else {
                        user.create0AuthUser(profile.emails[0].value,accessToken)
                            .then(ourUser => {return done(null, ourUser)})}})
        });
  }));

// GMAIL Authentication
  passport.use(new GoogleStrategy({
      clientID: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        user.checkUser(profile.emails[0].value)
                .then(result => {
                    if (result === true){
                        user.retreiveUser(profile.emails[0].value)
                            .then(ourUser => {
                                ourUser.updateUserActive();
                                return ourUser
                            })
                                .then(ourUser => {return done(null, ourUser)})
                    } else {
                        user.create0AuthUser(profile.emails[0].value,accessToken)
                            .then(ourUser => {return done(null, ourUser)})}})
    //   });
    }
  ));  

// models
const user = require('./models/user');

// views
const page = require('./views/page');
const signupForm = require('./views/signupForm');
const loginForm = require('./views/loginForm');
const resetForm = require('./views/resetForm');
const newPassword = require('./views/newPassword');

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
// display login or logout
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
app.get('/forgotpasswordconfirmation/:token',async (req,res) => {
    try {
       const decoded = jwt.verify(req.params.token,process.env.JWTKEY);
       await user.retreiveUser(decoded.user) 
            // .then(console.log)
                .then(ourUser => res.send(page(newPassword(ourUser))))
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

app.get('/forgotpassword', (req,res)=> {
    res.send(page(resetForm()))
});

app.post('/forgotpassword', (req,res)=> {
    user.retreiveUser(req.body.email)
        .then(ourUser => {
            return jwt.sign(
                {
                    user: ourUser.email
                },
                    process.env.JWTKEY,
                {
                    expiresIn: '1d'
                },(err,emailToken) => {
                    const url = `http://localhost:3000/forgotpasswordconfirmation/${emailToken}`;
                    transporter.sendMail({
                        to: req.body.email,
                        subject: "Reset Password ✔",
                        html: `Please click this link to reset password: <a href="${url}">${url}</a>`
                    });
                }
            )})
            .then(res.send(page("please check your email to reset password")))
            // need to fix catch
        // .catch(res.send(page(resetForm("This email is not registered"))))

});
app.post('/setnewpassword', (req,res)=> {
    user.retreiveUser(req.body.email)
        .then(ourUser => {
            ourUser.resetPassword(req.body.password)
        })
        .then(res.send(page("New password sucessfully set")))
});



app.get('/auth/google',
  passport.authenticate('google', { scope: ['email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
app.get('/login', (req, res) => {
    res.send(page(loginForm()));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/passed',
    failureRedirect: '/login'
  }),(req,res) => {
  });

app.get('/passed', (req, res) => {
    res.send(page(`you have succesfully logged in`,req.session));
});

app.post(`/logout`, (req, res) => {
    user.retreiveUser(req.user.email)
        .then(user => {
            user.updateUserNotActive()
        })
        .then(req.session.destroy(()=>{
            res.redirect(`/`); 
        }))    
});

app.listen(3000, () => {
    console.log('Express Ready')
});



// Oauth and regular login with same email?
// token expiration





// Sure, Most Helpful: Actually hearing about your real-life experiences and how you got to where you are now and giving perspective/examples on the best way to get there (showing the diffrent areas of a business and what skills align the most with CEO/Entrpeneur).  Most Confusing: Not a whole lot.  The whole idea of entrepeneurship and the best way to do it can be a bit confusing however as it is not an exact science and theres millions of ways to get there.