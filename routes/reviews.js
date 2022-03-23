const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware');
const reviewController = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;