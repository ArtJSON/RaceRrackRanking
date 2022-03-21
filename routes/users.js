const express = require('express');
const User = require('../models/user');
const router = express.Router({mergeParams: true});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Created new account');
    res.redirect('/racetracks');
});

module.exports = router;