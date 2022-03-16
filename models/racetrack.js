const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RacetrackSchema = new Schema({
    name: String,
    img: String,
    pricePerLap: {
        type: Number,
        min: 0
    },
    description: String,
    location: String
});

// export compiled racetrack schema
module.exports = mongoose.model('Racetrack', RacetrackSchema);