const { setDecOrInt } = require("../standalone-functions/set-level-filter");
const getAverage = async (database, collection, trackName, levelFilter) => {
  // Base pipeline filters for average ratings
  let queryFilters = [
    {
      $group: {
        _id: "$track",
        level_average: { $avg: "$level_opinion" },
      },
    },
    {
      $project: {
        _id: 0,
        track: "$_id",
        level_average: { $round: ["$level_average", 2] }, // round level_average to hundreths place before projecting
      },
    },
    { $sort: { level_average: -1 } },
  ];
  queryFilters = await buildQueryFilters(queryFilters, trackName, levelFilter);
  const average = await database
    .collection(collection)
    .aggregate(queryFilters)
    .toArray();
  return average;
};

const buildQueryFilters = async (queryFilters, trackName, levelFilter) => {
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
  } else if (trackName !== undefined && levelFilter === undefined) {
    queryFilters.splice(0, 0, {
      $match: {
        track: trackName,
      },
    });
  } else if (trackName !== undefined && levelFilter !== undefined) {
    let [lowerBoundLevel, higherBoundLevel] = setDecOrInt(levelFilter);
    queryFilters.splice(1, 0, {
      $match: {
        track: trackName,
        level_average: {
          $gte: Number(lowerBoundLevel),
          $lte: Number(higherBoundLevel),
        },
      },
    });
  }

  return queryFilters;
};

module.exports.getAverage = getAverage;
