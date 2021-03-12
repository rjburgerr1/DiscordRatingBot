const { deleteDocument } = require("../standalone-functions/deleteDocument");
const {
  collectTrackArg,
} = require("../standalone-functions/collectTrackArgument");
module.exports = {
  name: "delete",
  description: "Deletes a track rating of your own",
  async execute(message, args) {
    const track = await getTrackArgument(message, args, "delete");

    deleteDocument(message.author, track);
  },
};

const getTrackArgument = async (message, args, rateStr) => {
  let track;
  if (args[0] === undefined) {
    track = await collectTrackArg(message.author, message, rateStr);
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};