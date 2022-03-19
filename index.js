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
const reviews = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/racetracks/:id/reviews', reviews);
app.use('/racetracks', racetracks);

app.get('/', (req, res) => {
    res.render('index');
});

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