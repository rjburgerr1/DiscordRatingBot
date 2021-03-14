const { tracksDB } = require("../data/mongodb-utility.js");
const deleteDocument = async (rider, track) => {
  try {
    const response = await tracksDB.collection("ratings").deleteOne(
      {
        author: rider.username,
        track: track,
      },
      {
        collation: { locale: "en", strength: 1 },
      }
    );
    if (response.deletedCount > 0) {
      rider.send("```Deleted rating for " + track + "```");
    } else {
      rider.send(
        "```Did not find rating from you for " + track + " to delete```"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteDocument = deleteDocument;
