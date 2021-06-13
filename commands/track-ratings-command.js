const {
  getEachRating,
} = require("../standalone-functions/get-each-rating-mongo");
const { collectBasic } = require("../standalone-functions/message-collector");
const { capitalize } = require("../standalone-functions/capitalize");
const { tracksDB } = require("../data/mongodb-utility.js");
const { getAverage } = require("../standalone-functions/getAverageMongo");

const { getMedian } = require("../standalone-functions/getMedianMongo");

const { getMode } = require("../standalone-functions/getModeMongo");
const {
  paginate,
  sendPageMessage,
} = require("../standalone-functions/paginate");

module.exports = {
  name: "track",
  description: "Lists all the ratings for a specific track.",
  async execute(message, args) {
    try {
      const trackName = await getTrackArgument(message, args);
      const trackRatings = await getEachRating(tracksDB, "ratings", trackName);

      const averageRating = await getAverage(
        tracksDB,
        "ratings",
        trackName,
        undefined
      );
      const medianRating = await getMedian(
        tracksDB,
        "ratings",
        trackName,
        undefined
      );
      const modeRating = await getMode(
        tracksDB,
        "ratings",
        trackName,
        undefined
      );

      pages = await toString(
        trackRatings,
        trackName,
        averageRating,
        medianRating,
        modeRating
      );
      sendPageMessage(message.author, pages, 1);
      while (true) {
        try {
          let changePageNumber = await collectBasic(
            message.author,
            message,
            "```Type page numbers to display results```",
            20000,
            filterCollector
          );
          sendPageMessage(message.author, pages, changePageNumber);
        } catch (error) {
          //console.error(error);
          break;
        }
      }
    } catch (error) {
      message.author.send("```py\n" + error.message + "\n```");
    }

    //message.author.send(toString(riderRatingsMerged, riderName) + " ```");
  },
};

const toString = (
  ratingList,
  trackName,
  averageRating,
  medianRating,
  modeRating
) => {
  let pageHeader =
    "```ml\n" +
    "Track - '" +
    trackName +
    "' \t\t\t\t  Level (Average) - " +
    averageRating[0].level_average +
    " \t\tLevel (Median) - " +
    medianRating[0].level_median +
    " \t\tLevel (Mode) - " +
    modeRating[0].level_mode +
    "\n" +
    "------------------------------------\n" +
    "Rider                Level (Opinion)\n\n";

  let result = "";

  ratingList.forEach((rating) => {
    result +=
      capitalize(rating.author) +
      formatStringSpace(rating.author, 21) +
      rating.level_opinion +
      formatStringSpace(rating.level_opinion, 20) +
      "\n";
  });
  return paginate(result, pageHeader);
};

const getTrackArgument = async (message, args) => {
  const trackArgumentFilter = (msg) => {
    if (!msg.author.bot) {
      // Don't accept bot messages
      return true;
    }
  };
  let track;
  if (args[0] === undefined) {
    track = await collectBasic(
      message.author,
      message,
      "```Enter a track name to get all ratings for it.```",
      20000,
      trackArgumentFilter,
      "```No track name received within 20 seconds. Try !track again."
    );
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};

const formatStringSpace = (string, whitespace) => {
  let result = "";
  // parse string var to string if not so
  for (i = 0; i < whitespace - String(string).length; i++) {
    result += " ";
  }
  return result;
};

const leftJoin = (objArr1, objArr2, key1, key2) =>
  objArr1.map((anObj1) => ({
    ...objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
    ...anObj1,
  }));

const filterCollector = (msg) => {
  // If message isn't from a bot user and the message can be parsed to a number (for page number)
  if (!msg.author.bot && !isNaN(Number(msg.content))) {
    // Don't accept bot messages
    return true;
  }
};
