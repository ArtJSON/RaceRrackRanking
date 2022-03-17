const joi = require('joi');

module.exports.racetrackSchema = Joi.object({
    racetrack: Joi.object({
        name: Joi.string().required(),
        img: Joi.string().required(),
        pricePerLap: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});