const { tracksDB } = require("../data/mongodb-utility.js");
const { getMedian } = require("../standalone-functions/getMedianMongo");

const { getAllRatings } = require("../standalone-functions/getallRatingsMongo");
const { getAverage } = require("../standalone-functions/getAverageMongo");
const { getMode } = require("../standalone-functions/getModeMongo");
const findRatings = async (trackName, levelFilter) => {
  medianRatings = await getMedian(tracksDB, "ratings");
  modeRatings = await getMode(tracksDB, "ratings");
  averageRatings = await getAverage(
    tracksDB,
    "ratings",
    trackName,
    levelFilter
  );

  allRatings = await getAllRatings(tracksDB, "ratings", trackName);
  let mergedArray = leftJoin(allRatings, medianRatings, "track", "track");
  if (levelFilter !== undefined) {
    // If level filter is present, the average level for track ratings takes precedence for the final list of track
    mergedArray = leftJoin(averageRatings, mergedArray, "track", "track");
  } else {
    mergedArray = leftJoin(mergedArray, averageRatings, "track", "track");
  }
  mergedArray = leftJoin(mergedArray, modeRatings, "track", "track");

  return mergedArray;
  // Returns an array of track objects
};

const leftJoin = (objArr1, objArr2, key1, key2) =>
  objArr1.map((anObj1) => ({
    ...objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
    ...anObj1,
  }));
exports.findRatings = findRatings;
