const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Racetrack = require('../models/racetrack');
const { racetrackSchema } = require('../joischemas');

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

router.get('/', async (req, res) => {
    const racetracks = await Racetrack.find({});
    res.render('racetracks/index', { racetracks });
});

router.get('/new', (req, res) => {
    res.render('racetracks/new');
});

router.post('/', validateRaceTrack, catchAsync(async (req, res, next) => {
    const newRacetrack = new Racetrack(req.body.racetrack);
    newRacetrack.save();
    req.flash('success', 'Successfully created a new race track');
    res.redirect(`/racetracks/${newRacetrack.id}`);
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Racetrack.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the race track');
    res.redirect('/racetracks');
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.
    res.render('racetracks/edit', { racetrack });
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findById(id).populate('reviews'); 
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.render('racetracks/show', { racetrack });
}));

router.patch('/:id', validateRaceTrack, catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findByIdAndUpdate(id, req.body.racetrack);
    req.flash('success', 'Successfully updated race track data');
    res.redirect(`/racetracks/${racetrack.id}`)
}));

module.exports = router;