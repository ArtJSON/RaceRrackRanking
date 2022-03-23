const catchAsync = require('../utils/catchAsync');
const Racetrack = require('../models/racetrack');
const { isLoggedIn, validateRaceTrack, isAuthor } = require('../utils/middleware');
const racetrackController = require('../controllers/racetracks');

const express = require('express');
const router = express.Router();

router.get('/', catchAsync(racetrackController.index));

router.get('/new', isLoggedIn, racetrackController.renderNewForm);

router.post('/', isLoggedIn, validateRaceTrack, catchAsync(racetrackController.createRacetrack));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(racetrackController.deleteRacetrack));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(racetrackController.renderEditForm));

router.get('/:id', catchAsync(racetrackController.renderShowPage));

router.patch('/:id', isLoggedIn, isAuthor, validateRaceTrack, catchAsync(racetrackController.updateRacetrack));

module.exports = router;