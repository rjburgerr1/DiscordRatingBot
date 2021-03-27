const { tracksDB } = require("../data/mongodb-utility.js");
const { getMedian } = require("../standalone-functions/getMedianMongo");

const { getMode } = require("../standalone-functions/getModeMongo");
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
        level_average: { $round: ["$level_average", 2] }, // round level_average to hundreths place before projecting
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
  medianRatings = await getMedian(tracksDB, "ratings");
  modeRatings = await getMode(tracksDB, "ratings");
  allRatings = await tracksDB
    .collection("ratings")
    .aggregate(queryFilters)
    .toArray();
  let mergedArray = mergeArrays(medianRatings, allRatings);
  mergedArray = mergeArrays(modeRatings, mergedArray);
  return mergedArray;
  // Returns an array of track objects
};

// Method to find specific level ratings i.e.  7.3 or whole range level. i.e. 7-7.99
const setDecOrInt = (levelFilter) => {
  if (levelFilter.indexOf(".") == -1) {
    return [levelFilter, Number(levelFilter) + 0.99];
  } else {
    return [levelFilter, levelFilter];
  }
};

const mergeArrays = (firstArray, secondArray) => {
  let merged = [];

  for (let i = 0; i < firstArray.length; i++) {
    merged.push({
      ...firstArray[i],
      ...secondArray.find((itmInner) => itmInner.track === firstArray[i].track),
    });
  }
  return merged;
};
exports.findRatings = findRatings;
