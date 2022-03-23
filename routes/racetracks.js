const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Racetrack = require('../models/racetrack');
const { racetrackSchema } = require('../joischemas');
const isLoggedIn = require('../utils/isLoggedIn');

const express = require('express');
const router = express.Router();

const validateRaceTrack = (req, res, next) => {
    const result = racetrackSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const racetrack = await Racetrack.findById(id);
    if (!racetrack.author.equals(req.user_id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/racetracks/${id}`);
    }
    next();
};

router.get('/', async (req, res) => {
    const racetracks = await Racetrack.find({});
    res.render('racetracks/index', { racetracks });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('racetracks/new');
});

router.post('/', isLoggedIn, validateRaceTrack, catchAsync(async (req, res, next) => {
    const newRacetrack = new Racetrack(req.body.racetrack);
    newRacetrack.author = req.user._id;
    newRacetrack.save();
    req.flash('success', 'Successfully created a new race track');
    return res.redirect(`/racetracks/${newRacetrack.id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Racetrack.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the race track');
    res.redirect('/racetracks');
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.render('racetracks/edit', { racetrack });
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const racetrack = await Racetrack.findById(id).populate('reviews').populate('author'); 
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.render('racetracks/show', { racetrack });
}));

router.patch('/:id', isLoggedIn, isAuthor, validateRaceTrack, catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const racetrack = await Racetrack.findById(id, req.body.racetrack);
    req.flash('success', 'Successfully updated race track data');
    res.redirect(`/racetracks/${racetrack.id}`)
}));

module.exports = router;