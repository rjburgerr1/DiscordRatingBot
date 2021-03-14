const { tracksDB } = require("../data/mongodb-utility");
const getRider = async (rider) => {
  const riderDocs = tracksDB
    .collection("ratings")
    .find({ author: rider })
    .collation({ locale: "en", strength: 1 });

  return riderDocs.toArray();
};

module.exports.getRider = getRider;
