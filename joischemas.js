const Joi = require('joi');

module.exports.racetrackSchema = Joi.object({
    racetrack: Joi.object({
        name: Joi.string().required(),
        //img: Joi.string().required(),
        pricePerLap: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().required().min(0).max(10)
    }).required()
});