const catchAsync = require('../utils/catchAsync');
const Racetrack = require('../models/racetrack');
const { isLoggedIn, validateRaceTrack, isAuthor } = require('../utils/middleware');
const racetrackController = require('../controllers/racetracks');
const {storage} = require('../cloudinary');
const multer  = require('multer')
const upload = multer({ storage: storage })

const express = require('express');
const router = express.Router();

router.route('/')
    .get(catchAsync(racetrackController.index))
    //.post(isLoggedIn, validateRaceTrack, catchAsync(racetrackController.createRacetrack));
    .post(upload.array('racetrack[img]'), (req, res) => {res.send(req.files)});

router.get('/new', isLoggedIn, racetrackController.renderNewForm);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(racetrackController.renderEditForm));

router.route('/:id')
    .get(catchAsync(racetrackController.renderShowPage))
    .patch(isLoggedIn, isAuthor, validateRaceTrack, catchAsync(racetrackController.updateRacetrack))
    .delete(isLoggedIn, isAuthor, catchAsync(racetrackController.deleteRacetrack));

module.exports = router;