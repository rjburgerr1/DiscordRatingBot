const { tracksDB } = require("../data/mongodb-utility.js");
const findRatings = async (trackName) => {
  // DRY (maybe( cannot apply here as server-side functionality mixed with mongodb pipelines makes using external variables for the track filter very hard to inject.
  if (trackName === undefined) {
    return await tracksDB
      .collection("ratings")
      .aggregate([
        {
          $group: {
            _id: "$track",
            level_average: { $avg: "$level_opinion" },
            count: { $sum: 1 },
            lowestRating: {
              $min: { minRating: "$level_opinion", author: "$author" },
            },
            highestRating: {
              $max: { maxRating: "$level_opinion", author: "$author" },
            },
          },
        },
        { $sort: { level_average: -1 } },
      ])
      .toArray();
  } else {
    return await tracksDB
      .collection("ratings")
      .aggregate([
        { $match: { track: trackName } },
        {
          $group: {
            _id: "$track",
            level_average: { $avg: "$level_opinion" },
            count: { $sum: 1 },
            lowestRating: {
              $min: { minRating: "$level_opinion", author: "$author" },
            },
            highestRating: {
              $max: { maxRating: "$level_opinion", author: "$author" },
            },
          },
        },
        { $sort: { level_average: -1 } },
      ])
      .toArray();
  }
  // Returns an array of track objects
};

exports.findRatings = findRatings;
