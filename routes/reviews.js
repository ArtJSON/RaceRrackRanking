const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Racetrack = require('../models/racetrack');
const Review = require('../models/review');
const { reviewSchema } = require('../joischemas');
const isLoggedIn = require('../utils/isLoggedIn');

const express = require('express');
const router = express.Router({mergeParams: true});

// middleware to validate joi review schema 
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post('/', [isLoggedIn, validateReview], catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    const newReview = new Review(req.body.review);

    racetrack.reviews.push(newReview);

    await newReview.save();
    await racetrack.save();

    req.flash('success', 'Successfully added a new review');

    res.redirect(`/racetracks/${racetrack.id}`);
}));

router.delete('/:review_id', isLoggedIn, catchAsync(async (req, res, next) => {
    const {id, review_id} = req.params
    
    await Racetrack.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);

    req.flash('success', 'Successfully deleted the review');

    res.redirect(`/racetracks/${id}`);
}));

module.exports = router;