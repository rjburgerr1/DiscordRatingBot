const { tracksDB } = require("../data/mongodb-utility.js");
const deleteDocument = async (rider, ratingsToDelete, allRatings) => {
  const filter = setFilter(rider, ratingsToDelete, allRatings);

  try {
    const response = !allRatings
      ? await tracksDB
          .collection("ratings")
          .deleteOne(filter, { collation: { locale: "en", strength: 1 } })
      : await tracksDB
          .collection("ratings")
          .deleteMany(filter, { collation: { locale: "en", strength: 1 } });

    const deletedTracks = await buildDeletedTracksStr(ratingsToDelete);

    if (response.deletedCount > 0) {
      rider.send("```cs\nDeleted rating(s) for " + deletedTracks + "\n```");
    } else {
      rider.send(
        "```cs\nCould not delete rating(s) for " + rider.username + "\n```"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const buildDeletedTracksStr = async (ratingsToDelete) => {
  let tracks = "";
  ratingsToDelete.forEach((rating) => {
    tracks += "'" + rating.track + "', ";
  });
  return tracks.substr(0, tracks.length - 2);
};

const setFilter = (rider, ratingsToDelete, allRatings) => {
  const filter = !allRatings
    ? {
        author: rider.username,
        track: ratingsToDelete[0].track,
      }
    : {
        author: rider.username,
      };

  return filter;
};

module.exports.deleteDocument = deleteDocument;
