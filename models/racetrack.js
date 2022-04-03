const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imgSchema = new Schema({
  url: String,
  filename: String,
});

imgSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_200,w_300");
});
imgSchema.virtual("carousel").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_600,w_800");
});

const RacetrackSchema = new Schema({
  name: String,
  img: [imgSchema],
  pricePerLap: {
    type: Number,
    min: 0,
  },
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

RacetrackSchema.methods.getDistance = function (lon, lat) {
  const R = 6371e3; // metres
  const φ1 = (lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (this.geometry.coordinates[1] * Math.PI) / 180;
  const Δφ = ((this.geometry.coordinates[1] - lat) * Math.PI) / 180;
  const Δλ = ((this.geometry.coordinates[0] - lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

// middleware to delete all reviews of a removed racetrack
RacetrackSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const removeReviews = async (req, res, next) => {
  const racetrack = await Racetrack.findById(req.params.id);

  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// export compiled racetrack schema
module.exports = mongoose.model("Racetrack", RacetrackSchema);
