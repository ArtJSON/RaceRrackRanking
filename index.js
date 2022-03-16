const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Racetrack = require('./models/racetrack');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')

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

app.listen(3333, () => {
    console.log('Listening on port 3333');
});

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

app.post('/racetracks', async (req, res) => {
    const newRacetrack = new Racetrack(req.body);
    newRacetrack.save();
    res.redirect(`/racetracks/${newRacetrack.id}`);
});

app.delete('/racetracks/:id', async (req, res) => {
    const {id} = req.params;
    await Racetrack.findByIdAndDelete(id);
    res.redirect('/racetracks');
});

app.get('/racetracks/:id/edit', async (req, res) => {
    const racetrack = await Racetrack.findById(req.params.id);
    res.render('racetracks/edit', { racetrack });
});

app.get('/racetracks/:id', async (req, res) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findById(id);
    res.render('racetracks/show', { racetrack });
});

app.patch('/racetracks/:id', async (req, res) => {
    const id = req.params.id;
    const racetrack = await Racetrack.findByIdAndUpdate(id, req.body);
    res.redirect(`/racetracks/${racetrack.id}`)
});


