const { tracksDB } = require("../data/mongodb-utility");
const getRider = async (rider, levelFilter) => {
  try {
    var queryFilters = { author: rider };
    if (levelFilter !== undefined) {
      queryFilters["level_opinion"] = {
        $gte: Number(levelFilter),
        $lt: Number(levelFilter) + 1,
      };
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
