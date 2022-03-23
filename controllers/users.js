const User = require('../models/user');
const express = require('express');

module.exports.register = async (req, res) => {
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
}


module.exports.showRegisterForm = (req, res) => {
    res.render('users/register');
}


module.exports.showLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.logIn = (req, res) => {
    req.flash('success', 'Succesfully logged in');
    let redirectUrl = req.session.returnTo || '/racetracks';
    if (redirectUrl.includes("reviews")) {
        redirectUrl = redirectUrl.replace('reviews','');
    }
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Succesfully logged out");
    res.redirect('/racetracks');
}