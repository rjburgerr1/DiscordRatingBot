const getEachRating = async (database, collection, trackName) => {
  const eachRating = await database
    .collection(collection)
    .find({ track: trackName })
    .collation({ locale: "en_US", strength: 1 })
    .toArray();

  return eachRating;
};
module.exports.getEachRating = getEachRating;
