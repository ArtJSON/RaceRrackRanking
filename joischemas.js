const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.racetrackSchema = Joi.object({
  racetrack: Joi.object({
    name: Joi.string().required().escapeHTML(),
    //img: Joi.string().required(),
    pricePerLap: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    text: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(0).max(10),
  }).required(),
});
