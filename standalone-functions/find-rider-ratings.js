const { tracksDB } = require("../data/mongodb-utility");
const getRider = async (rider, levelFilter, trackName) => {
  try {
    var queryFilters = { author: rider };
    if (levelFilter !== undefined) {
      queryFilters["level_opinion"] = {
        $gte: Number(levelFilter),
        $lt: Number(levelFilter) + 1,
      };
    }

    if (trackName !== undefined) {
      queryFilters["track"] = trackName;
    }
    return await tracksDB
      .collection("ratings")
      .find(queryFilters)
      .collation({ locale: "en", strength: 1 })
      .sort({ level_opinion: -1 })
      .toArray();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getRider = getRider;
