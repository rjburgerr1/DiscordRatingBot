const { setDecOrInt } = require("../standalone-functions/set-level-filter");
const getMode = async (database, collection, trackName, levelFilter) => {
  // Base pipeline filters for mode ratings
  let queryFilters = [
    {
      $group: {
        _id: "$track",
        levels: { $push: "$level_opinion" },
      },
    },

    { $unwind: "$levels" },

    {
      $group: {
        _id: {
          track: "$_id",
          level: "$levels",
        },
        levelCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        level_opinion: -1,
      },
    },
    {
      $sort: {
        levelCount: -1,
      },
    },
    {
      $group: {
        _id: "$_id.track",
        levels: {
          $push: { level_opinion: "$_id.level", count: "$levelCount" },
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $addFields: {
        level_mode: { $first: "$levels.level_opinion" },
      },
    },
    {
      $project: {
        _id: 0,
        track: "$_id",
        level_mode: 1,
      },
    },
  ];

  queryFilters = await buildQueryFilters(queryFilters, trackName, levelFilter);
  const mode = await database
    .collection(collection)
    .aggregate(queryFilters)
    .toArray();
  return mode;
};

const buildQueryFilters = async (queryFilters, trackName, levelFilter) => {
  if (trackName === undefined && levelFilter !== undefined) {
    let [lowerBoundLevel, higherBoundLevel] = setDecOrInt(levelFilter);
    queryFilters.splice(8, 0, {
      $match: {
        level_mode: {
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
    queryFilters.splice(8, 0, {
      $match: {
        track: trackName,
        level_mode: {
          $gte: Number(lowerBoundLevel),
          $lte: Number(higherBoundLevel),
        },
      },
    });
  }

  return queryFilters;
};

module.exports.getMode = getMode;
