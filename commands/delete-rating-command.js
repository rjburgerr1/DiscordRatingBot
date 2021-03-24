const {
  deleteDocument,
} = require("../standalone-functions/delete-rider-rating");
const { collectBasic } = require("../standalone-functions/message-collector");
const { getRider } = require("../standalone-functions/find-rider-ratings");

module.exports = {
  name: "delete",
  description: "Deletes a track rating of your own",
  async execute(message, args) {
    try {
      const track = await getTrackArgument(message, args);
      const ratingToDelete = await getRider(
        message.author.username,
        undefined,
        track
      );

      message.author.send(
        "```yaml\n" +
          "Rider: " +
          ratingToDelete[0].author +
          "\nTrack: " +
          ratingToDelete[0].track +
          "\nLevel Opinion: " +
          ratingToDelete[0].level_opinion +
          "\n```"
      );

      await getConfirmation(message, args);
      deleteDocument(message.author, track);
    } catch (error) {
      console.log(error);
    }
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
      trackArgumentFilter,
      "```No track name received within 20 seconds. Try !delete again."
    );
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};

const getConfirmation = async (message, trackName) => {
  const warningConfirmationFilter = (msg) => {
    if (!msg.author.bot && msg.content.toLowerCase() === "y") {
      return true;
    }
  };

  await collectBasic(
    message.author,
    message,
    "```Are you sure you want to delete this rating? (y)```",
    20000,
    warningConfirmationFilter,
    "```Did not receive confirmation, try !delete again.```"
  );
};
