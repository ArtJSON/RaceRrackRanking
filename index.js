const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Racetrack = require('./models/racetrack');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { racetrackSchema, reviewSchema } = require('./joischemas');

const racetracks = require("./routes/racetracks");

app.use('/racetracks', racetracks);

// mongoose connection to mongoDB
mongoose.connect('mongodb://localhost:27017/racetrackDB').then(() => {
    console.log("Racetack database connection open");
}).catch(error => {
    console.log("Error during connection to the racetrack database: ");
    console.log(error);
});

// set express view engine to ejs and changed the default path of views dir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// middleware to validate joi race track schema 
const validateRaceTrack = (req, res, next) => {
    const result = racetrackSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

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

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/racetracks/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    const newReview = new Review(req.body.review);

    racetrack.reviews.push(newReview);

    await newReview.save();
    await racetrack.save();

    res.redirect(`/racetracks/${racetrack.id}`);
}));

app.delete('/racetracks/:racetrack_id/reviews/:review_id', catchAsync(async (req, res, next) => {
    const {racetrack_id, review_id} = req.params
    
    await Racetrack.findByIdAndUpdate(racetrack_id, {$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);

    res.redirect(`/racetracks/${racetrack_id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) {
        err.message = "No error message"
    }
    res.status(statusCode).render('error', { err });
});


app.listen(3333, () => {
    console.log('Listening on port 3333');
});