const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const userController = require('../controllers/users');

router.route('/register')
    .get(userController.showRegisterForm)
    .post(catchAsync(userController.register));

router.route('/login')
    .get(userController.showLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.logIn);

router.get('/logout', userController.logout);

module.exports = router;