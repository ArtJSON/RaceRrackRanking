const catchAsync = require('../utils/catchAsync');
const Racetrack = require('../models/racetrack');
const Review = require('../models/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware');

const express = require('express');
const router = express.Router({mergeParams: true});

router.post('/', [isLoggedIn, validateReview], catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    racetrack.reviews.push(newReview);

    await newReview.save();
    await racetrack.save();

    req.flash('success', 'Successfully added a new review');

    res.redirect(`/racetracks/${racetrack.id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const {id, reviewId} = req.params
    
    await Racetrack.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted the review');

    res.redirect(`/racetracks/${id}`);
}));

module.exports = router;