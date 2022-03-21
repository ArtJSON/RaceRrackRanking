const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const RacetrackSchema = new Schema({
    name: String,
    img: String,
    pricePerLap: {
        type: Number,
        min: 0
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// middleware to delete all reviews of a removed racetrack
RacetrackSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const removeReviews = async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);

    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// export compiled racetrack schema
module.exports = mongoose.model('Racetrack', RacetrackSchema);