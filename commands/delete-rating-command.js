const {
  deleteDocument,
} = require("../standalone-functions/delete-rider-rating");
const { collectBasic } = require("../standalone-functions/message-collector");

module.exports = {
  name: "delete",
  description: "Deletes a track rating of your own",
  async execute(message, args) {
    const track = await getTrackArgument(message, args);

    deleteDocument(message.author, track);
  },
};

const getTrackArgument = async (message, args) => {
  const trackArgumentFilter = (msg) => {
    if (!msg.author.bot) {
      return true;
    }
  };
  let track;
  if (args[0] === undefined) {
    track = await collectBasic(
      message.author,
      message,
      "```Type the name of the track that you want to delete.```",
      20000,
      trackArgumentFilter
    );
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};
