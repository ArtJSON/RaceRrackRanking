const Review = require('../models/review');
const Racetrack = require('../models/racetrack');

module.exports.postReview = async (req, res) => {
    const racetrack = await Racetrack.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    racetrack.reviews.push(review);

    await review.save();
    await racetrack.save();

    req.flash('success', 'Successfully added a new review');

    res.redirect(`/racetracks/${racetrack.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    
    await Racetrack.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted the review');

    res.redirect(`/racetracks/${id}`);
}