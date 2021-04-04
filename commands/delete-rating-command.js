const {
  deleteDocument,
} = require("../standalone-functions/delete-rider-rating");
const { collectBasic } = require("../standalone-functions/message-collector");
const { getRider } = require("../standalone-functions/find-rider-ratings");
const { capitalize } = require("../standalone-functions/capitalize");

const {
  formatStringSpace,
} = require("../standalone-functions/format-string-space");

const {
  paginate,
  sendPageMessage,
} = require("../standalone-functions/paginate");

module.exports = {
  name: "delete",
  description: "Deletes a track rating of your own",
  async execute(message, args) {
    try {
      let track = await getTrackArgument(message, args);

      const allRatings = track.toLowerCase() !== "all" ? false : true;

      track = track.toLowerCase() !== "all" ? track : undefined;
      let ratingsToDelete = await getRider(
        message.author.username,
        undefined,
        track
      );

      // Paginate and format track ratings for rider
      await getConfirmation(message, ratingsToDelete);
      console.log("Confirmed Deletion ");

      await deleteDocument(message.author, ratingsToDelete, allRatings);
    } catch (error) {
      message.author.send("```fix\n" + "Could not delete rating(s)." + "\n```");
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

const getConfirmation = async (message, ratingsToDelete) => {
  const warningConfirmationFilter = (msg) => {
    if (!msg.author.bot && msg.content.toLowerCase() === "y") {
      return true;
    }
  };

  // Confirmation Message
  let confMsgHeader =
    "```xl\n" +
    "Track                   Level_Opinion\n" +
    "-------------------------------------\n";
  let confMsg = "";
  ratingsToDelete.forEach((rating) => {
    confMsg +=
      capitalize(rating.track) +
      formatStringSpace(rating.track, 24) +
      rating.level_opinion +
      "\n";
  });

  pages = paginate(confMsg, /(.|\n){1,1000}\n/g, confMsgHeader);
  sendPageMessage(message, pages, 1);
  while (true) {
    try {
      let changePageNumber = await collectBasic(
        message.author,
        message,
        "```Are you sure you want to delete this rating? (y) \n\n - Type page numbers to display other results```",
        20000,
        filterCollector,
        "```Did not receive confirmation, try !delete again.```"
      );
      if (changePageNumber.toLowerCase() !== "y") {
        sendPageMessage(message, pages, changePageNumber);
      } else {
        break;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

const filterCollector = (msg) => {
  // If message isn't from a bot user and the message can be parsed to a number (for page number)
  if (
    !msg.author.bot &&
    !isNaN(Number(msg.content) || msg.content.toLowerCase() === "y")
  ) {
    // Don't accept bot messages
    return true;
  }
};
