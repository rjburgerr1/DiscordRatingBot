const getMode = async (database, collection) => {
  mode = await database
    .collection(collection)
    .aggregate([
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
          track: "$_id",
          level_mode: 1,
        },
      },
    ])
    .toArray();

  return mode;
};
module.exports.getMode = getMode;
