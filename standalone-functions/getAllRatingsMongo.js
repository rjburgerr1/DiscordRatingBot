const getAllRatings = async (database, collection, trackName) => {
  // Base pipeline filters for average ratings
  var queryFilters = [
    {
      $group: {
        _id: "$track",
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
        lowestRating: 1,
        highestRating: 1,
      },
    },
  ];

  if (trackName !== undefined) {
    queryFilters.splice(0, 0, {
      $match: {
        track: trackName,
      },
    });
  }
  const allRatings = await database
    .collection(collection)
    .aggregate(queryFilters)
    .toArray();

  return allRatings;
};
module.exports.getAllRatings = getAllRatings;
