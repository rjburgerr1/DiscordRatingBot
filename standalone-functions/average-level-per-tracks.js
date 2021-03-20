const { tracksDB } = require("../data/mongodb-utility.js");
const calculateLevels = async (trackName) => {
  let trackNameFilter = "";
  if (trackName !== undefined) {
    trackNameFilter = "{ $match: { track: " + trackName + " } }";
  }
  let test = "track: " + '"' + trackName + '"';
  console.log(test);
  const averageLevelPerTrackArray = await tracksDB
    .collection("ratings")
    .aggregate([
      { $match: { track: trackName } },
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

  // Returns an array of track objects
  return averageLevelPerTrackArray;
};

module.exports.calculateLevels = calculateLevels;
