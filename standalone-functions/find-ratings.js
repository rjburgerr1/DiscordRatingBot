const { tracksDB } = require("../data/mongodb-utility.js");
const findRatings = async (trackName, levelFilter) => {
  // Base pipeline filters for ratings
  var queryFilters = [
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
  ];

  if (trackName !== undefined && levelFilter === undefined) {
    queryFilters.unshift({ $match: { track: trackName } });
  } else if (trackName === undefined && levelFilter !== undefined) {
    queryFilters.unshift({
      $match: {
        level_opinion: {
          $gte: Number(levelFilter),
          $lt: Number(levelFilter) + 1,
        },
      },
    });
  }
  return await tracksDB.collection("ratings").aggregate(queryFilters).toArray();
  // Returns an array of track objects
};

exports.findRatings = findRatings;
