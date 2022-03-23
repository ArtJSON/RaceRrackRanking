const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const userController = require('../controllers/users');

router.get('/register', userController.showRegisterForm);

router.post('/register', catchAsync(userController.register));

router.get('/login', userController.showLoginForm);

// create flash if failure, redirect back to login if failure
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.logIn);

router.get('/logout', userController.logout);

module.exports = router;