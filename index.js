const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Racetrack = require('./models/racetrack');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/racetracks', async (req, res) => {
    const racetracks = await Racetrack.find({});
    res.render('racetracks/index', { racetracks });
});

app.get('/racetracks/new', (req, res) => {
    res.render('racetracks/new');
});

app.post('/racetracks', catchAsync(async (req, res, next) => {
    const newRacetrack = new Racetrack(req.body);
    newRacetrack.save();
    res.redirect(`/racetracks/${newRacetrack.id}`);
}));

app.delete('/racetracks/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Racetrack.findByIdAndDelete(id);
    res.redirect('/racetracks');
}));

app.get('/racetracks/:id/edit', catchAsync(async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    res.render('racetracks/edit', { racetrack });
}));

app.get('/racetracks/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findById(id);
    res.render('racetracks/show', { racetrack });
}));

app.patch('/racetracks/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findByIdAndUpdate(id, req.body);
    res.redirect(`/racetracks/${racetrack.id}`)
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