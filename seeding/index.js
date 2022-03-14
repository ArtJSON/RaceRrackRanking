// helper file used to clear and repopulate the Racetrack database with some data
const mongoose = require('mongoose');
const Racetrack = require('../models/racetrack');
const sampleRacetracks = require('../seeding/racetrackSeeds');

// mongoose connection to mongoDB
mongoose.connect('mongodb://localhost:27017/racetrackDB').then(() => {
    console.log("Racetack database connection open");
}).catch(error => {
    console.log("Error during connection to the racetrack database: ");
    console.log(error);
});

const seedDB = async function() {
    // delete everything from the DB
    await Racetrack.deleteMany({});

    for (let racetrack of sampleRacetracks) {
        const tempRacetrack = new Racetrack(racetrack);
        await tempRacetrack.save();
    }
}

seedDB();