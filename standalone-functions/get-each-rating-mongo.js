const getEachRating = async (database, collection, trackName) => {
  const eachRating = await database
    .collection(collection)
    .find({ track: trackName })
    .toArray();

  return eachRating;
};
module.exports.getEachRating = getEachRating;
