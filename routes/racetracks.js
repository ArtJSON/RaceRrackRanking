const catchAsync = require('../utils/catchAsync');
const Racetrack = require('../models/racetrack');
const { isLoggedIn, validateRaceTrack, isAuthor } = require('../utils/middleware');

const express = require('express');
const router = express.Router();

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
    const racetrack = await Racetrack.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); 
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