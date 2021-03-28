const { setDecOrInt } = require("../standalone-functions/set-level-filter");
const getMedian = async (database, collection, levelFilter) => {
  const queryFilters = setQueryFilters(levelFilter);
  console.log(queryFilters);
  const median = await database
    .collection(collection)
    .aggregate(queryFilters)
    .toArray();
  return median;
};

const setQueryFilters = (levelFilter) => {
  // default median pipeline
  let queryFilters = [
    {
      $group: {
        _id: "$track",
        valueArray: {
          $push: "$level_opinion",
        },
      },
    },
    { $sort: { level_opinion: 1 } },
    {
      $project: {
        _id: 0,
        track: "$_id",
        valueArray: 1,
        size: { $size: ["$valueArray"] },
      },
    },
    {
      $project: {
        track: 1,
        valueArray: 1,
        isEvenLength: { $eq: [{ $mod: ["$size", 2] }, 0] },
        middlePoint: { $trunc: { $divide: ["$size", 2] } },
      },
    },
    {
      $project: {
        track: 1,
        valueArray: 1,
        isEvenLength: 1,
        middlePoint: 1,
        beginMiddle: { $subtract: ["$middlePoint", 1] },
        endMiddle: "$middlePoint",
      },
    },
    {
      $project: {
        track: 1,
        valueArray: 1,
        middlePoint: 1,
        beginMiddle: 1,
        beginValue: { $arrayElemAt: ["$valueArray", "$beginMiddle"] },
        endValue: { $arrayElemAt: ["$valueArray", "$endMiddle"] },
        isEvenLength: 1,
      },
    },
    {
      $project: {
        track: 1,
        valueArray: 1,
        middlePoint: 1,
        beginMiddle: 1,
        beginValue: 1,
        endValue: 1,
        middleSum: { $add: ["$beginValue", "$endValue"] },
        isEvenLength: 1,
      },
    },
    {
      $project: {
        track: 1,
        level_median: {
          $cond: {
            if: "$isEvenLength",
            then: { $divide: ["$middleSum", 2] },
            else: { $arrayElemAt: ["$valueArray", "$middlePoint"] },
          },
        },
      },
    },
  ];

  if (levelFilter !== undefined) {
    let [lowerBoundLevel, higherBoundLevel] = setDecOrInt(levelFilter);
    queryFilters.push({
      $match: {
        level_median: {
          $gte: Number(lowerBoundLevel),
          $lte: Number(higherBoundLevel),
        },
      },
    });
  }
  return queryFilters;
};

module.exports.getMedian = getMedian;
