const { tracksDB } = require("../data/mongodb-utility");
const { setDecOrInt } = require("../standalone-functions/set-level-filter");
const getRider = async (rider, levelFilter, trackName) => {
  try {
    // Will get all ratings for a rider if no other arguments specified
    var queryFilters = { author: rider };

    // If level filter argument is included, set range of levels
    if (levelFilter !== undefined) {
      let [lowerBoundLevel, higherBoundLevel] = setDecOrInt(levelFilter);
      queryFilters["level_opinion"] = {
        $gte: Number(lowerBoundLevel),
        $lte: Number(higherBoundLevel),
      };
    }

    // If track name argument is included, add track name to filter
    if (trackName !== undefined) {
      queryFilters["track"] = trackName;
    }

    const riderRatings = await tracksDB
      .collection("ratings")
      .find(queryFilters)
      .collation({ locale: "en", strength: 1 })
      .sort({ level_opinion: -1 })
      .toArray();

    if (riderRatings.length === 0)
      throw new Error("Could not find ratings from '" + rider + "'.");

    return riderRatings;
  } catch (error) {
    //console.error(error);
    throw error;
  }
};

module.exports.getRider = getRider;
