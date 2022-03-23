const { racetrackSchema, reviewSchema } = require('../joischemas');
const Racetrack = require('../models/racetrack');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to perform this action');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateRaceTrack = (req, res, next) => {
    const result = racetrackSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const racetrack = await Racetrack.findById(id);
    if (!racetrack.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/racetracks/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/racetracks/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};