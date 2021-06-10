const {
  deleteDocument,
} = require("../standalone-functions/delete-rider-rating");
const { collectBasic } = require("../standalone-functions/message-collector");
const { getRider } = require("../standalone-functions/find-rider-ratings");
const { capitalize } = require("../standalone-functions/capitalize");
const { findRatings } = require("../standalone-functions/find-ratings");

const { leftJoin } = require("../standalone-functions/left-join");

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
      await listPotentialDeletions(message.author);
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

      await deleteDocument(message.author, ratingsToDelete, allRatings);
    } catch (error) {
      //message.author.send("```fix\n" + "Could not delete rating(s)." + "\n```");
      //console.error(error);
    }
  },
};

const listPotentialDeletions = async (rider) => {
  var pages = await getRiderRatings(rider);
  sendPageMessage(rider, pages, 1);
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
      "```No track name received within 20 seconds. Try !delete again.```"
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

  pages = paginate(confMsg, confMsgHeader);
  sendPageMessage(message.author, pages, 1);
  while (true) {
    try {
      let changePageNumber = await collectBasic(
        message.author,
        message,
        "```Are you sure you want to delete the rating(s)? (y) \n\n - Type page numbers to display more tracks to delete (For 'all' option)```",
        10000,
        filterCollector,
        "```Did not receive confirmation, try !delete again.```"
      );
      if (changePageNumber.toLowerCase() !== "y") {
        sendPageMessage(message.author, pages, changePageNumber);
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

const getRiderRatings = async (rider, levelFilter, trackName) => {
  try {
    const riderSpecificRatings = await getRider(
      rider.username,
      levelFilter,
      trackName
    );
    const allRatings = await findRatings(undefined, undefined);
    const riderRatingsMerged = leftJoin(
      riderSpecificRatings,
      allRatings,
      "track",
      "track"
    );

    return toString(riderRatingsMerged, rider.username);
  } catch (error) {
    //console.error(error);
  }
};

const toString = (trackList, riderName) => {
  let pageHeader =
    "```ml\n" +
    "Rider - '" +
    riderName +
    "'\n" +
    "-----------------------------------------------------------------------------------------------------------------------------------------------------------\n" +
    "Track                Level (Opinion)     Level (Average)     Level (Median)     Level (Mode)     # of Ratings      Lowest Rating             Highest Rating\n\n";

  let result = "";

  trackList.forEach((track) => {
    result +=
      capitalize(track.track) +
      //25 because that is how many whitespace characters are between the end of "track" and the beginning of "Ninja Level". Similar idea down below for "31"
      formatStringSpace(track.track, 21) +
      track.level_opinion +
      formatStringSpace(String(track.level_opinion), 20) +
      track.level_average +
      formatStringSpace(String(track.level_average), 20) +
      track.level_median +
      formatStringSpace(String(track.level_median), 20) +
      track.level_mode +
      formatStringSpace(String(track.level_mode), 16) +
      track.count +
      formatStringSpace(String(track.count), 18) +
      track.lowestRating.author +
      " - " +
      track.lowestRating.minRating +
      formatStringSpace(
        track.lowestRating.author +
          " - " +
          String(track.lowestRating.minRating),
        26
      ) +
      track.highestRating.maxRating +
      " - " +
      track.highestRating.author +
      "\n";
  });
  return paginate(result, pageHeader);
};
