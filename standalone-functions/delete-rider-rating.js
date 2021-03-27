const { tracksDB } = require("../data/mongodb-utility.js");
const deleteDocument = async (rider, track, allRatings) => {
  let filter = setFilter(rider, track, allRatings);
  if (track === undefined) {
    track = "every track";
  }
  try {
    const response = await tracksDB.collection("ratings").deleteMany(filter);
    if (response.deletedCount > 0) {
      rider.send("```cs\nDeleted rating for '" + track + "'\n```");
    } else {
      rider.send("```cs\nCould not delete rating(s) for'" + track + "'\n```");
    }
  } catch (error) {
    console.log(error);
  }
};

const setFilter = (rider, track, allRatings) => {
  var filter = {
    author: rider.username,
    track: track,
  };
  filter["collation"] = { locale: "en", strength: 1 };

  if (allRatings) {
    (filter = {
      author: rider.username,
    }),
      {
        collation: { locale: "en", strength: 1 },
      };
  }
  return filter;
};

module.exports.deleteDocument = deleteDocument;
