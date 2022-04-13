/**
 * Pass in racetracks with populated reviews
 */
module.exports = async (racetracks) => {
  for (racetrack of racetracks) {
    const id = racetrack.id;
    const reviews = racetrack.id;

    if (racetrack.reviews.length) {
      let sum = 0;
      for (review of racetrack.reviews) {
        sum += review.rating;
      }

      racetrack.avg = sum / racetrack.reviews.length;
    } else {
      racetrack.avg = -1;
    }
  }
};
