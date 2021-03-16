const { tracksDB } = require("../data/mongodb-utility");
const getRider = async (rider, levelFilter) => {
  try {
    let riderDocs;
    if (levelFilter === undefined) {
      riderDocs = tracksDB
        .collection("ratings")
        .find({
          author: rider,
        })
        .collation({ locale: "en", strength: 1 })
        .sort({ level_opinion: -1 });
    } else {
      riderDocs = tracksDB
        .collection("ratings")
        .find({
          author: rider,
          level_opinion: {
            $gte: Number(levelFilter),
            $lt: Number(levelFilter) + 1,
          },
        })
        .collation({ locale: "en", strength: 1 })
        .sort({ level_opinion: -1 });
    }

    return riderDocs.toArray();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getRider = getRider;
