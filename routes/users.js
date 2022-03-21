const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        // automatically log in after signing up
        req.login(user, err => {
            if (err) {
                return next();
            } else {
                req.flash('success', 'Created new account');
                res.redirect('/racetracks');
            }
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

router.get('/login',(req, res) => {
    res.render('users/login')
});

// create flash if failure, redirect back to login if failure
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
   req.flash('success', 'Succesfully logged in');
   let redirectUrl = req.session.returnTo || '/racetracks';
   if (redirectUrl.includes("reviews")) {
       redirectUrl = redirectUrl.replace('reviews','');
   }
   delete req.session.returnTo;
   res.redirect(redirectUrl);
});

router.get('/logout',(req, res) => {
    req.logout();
    req.flash('success', "Succesfully logged out");
    res.redirect('/racetracks');
});

module.exports = router;