const { db } = require("../data/mongoUtil");
const calculateLevels = async (channel, message, client) => {
  /*
  const groupByTrackArray = await db
    .collection("ratings")
    .aggregate([{ $group: { _id: "$track", data: { $push: "$$ROOT" } } }])
    .toArray();
  console.log(groupByTrackArray[0].data);
  console.log(groupByTrackArray);
  */

  const averageLevelPerTrackArray = await db
    .collection("ratings")
    .aggregate([
      {
        $group: {
          _id: "$track",
          level_average: { $avg: "$level_opinion" },
          count: { $sum: 1 },
        },
      },
      { $sort: { level_average: -1 } },
    ])
    .toArray();

  console.log(averageLevelPerTrackArray[0].level_average);
  console.log(averageLevelPerTrackArray);

  console.log(await db.collection("ratings").countDocuments());
  return averageLevelPerTrackArray;
};

module.exports.calculateLevels = calculateLevels;
