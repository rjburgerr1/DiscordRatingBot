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
    {
      $project: {
        _id: 0,
        track: "$_id",
        count: 1,
        level_average: 1,
        lowestRating: 1,
        highestRating: 1,
      },
    },
    { $sort: { level_average: -1 } },
  ];

  if (trackName === undefined && levelFilter !== undefined) {
    let [lowerBoundLevel, higherBoundLevel] = setDecOrInt(levelFilter);
    queryFilters.splice(1, 0, {
      $match: {
        level_average: {
          $gte: Number(lowerBoundLevel),
          $lte: Number(higherBoundLevel),
        },
      },
    });
  }
  return await tracksDB.collection("ratings").aggregate(queryFilters).toArray();
  // Returns an array of track objects
};

const setDecOrInt = (levelFilter) => {
  if (levelFilter.indexOf(".") == -1) {
    return [levelFilter, Number(levelFilter) + 0.99];
  } else {
    return [levelFilter, levelFilter];
  }
};

exports.findRatings = findRatings;
