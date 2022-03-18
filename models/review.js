const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    text: String,
    rating: {
        type: Number,
        min: 0,
        max: 10
    }
});