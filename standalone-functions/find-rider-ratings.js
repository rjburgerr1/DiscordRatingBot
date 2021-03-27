const { tracksDB } = require("../data/mongodb-utility");
const getRider = async (rider, levelFilter, trackName) => {
  try {
    // Will get all ratings for a rider if no other arguments specified
    var queryFilters = { author: rider };

    // If level filter argument is included, set range of levels
    if (levelFilter !== undefined) {
      queryFilters["level_opinion"] = {
        $gte: Number(levelFilter),
        $lt: Number(levelFilter) + 1,
      };
    }

    // If track name argument is included, add track name to filter
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
