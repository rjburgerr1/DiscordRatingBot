const { tracksDB } = require("../data/mongodb-utility.js");
const calculateLevels = async (channel, message, client) => {
  /*
  const groupByTrackArray = await db
    .collection("ratings")
    .aggregate([{ $group: { _id: "$track", data: { $push: "$$ROOT" } } }])
    .toArray();
  console.log(groupByTrackArray[0].data);
  console.log(groupByTrackArray);
  */

  // Returns an array of track objects
  const averageLevelPerTrackArray = await tracksDB
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

  console.log(await tracksDB.collection("ratings").countDocuments());
  return averageLevelPerTrackArray;
};

module.exports.calculateLevels = calculateLevels;
