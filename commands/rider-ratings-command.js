const { getRider } = require("../standalone-functions/find-rider-ratings");
const { findRatings } = require("../standalone-functions/find-ratings");
const { collectBasic } = require("../standalone-functions/message-collector");
const { capitalize } = require("../standalone-functions/capitalize");
const {
  paginate,
  sendPageMessage,
} = require("../standalone-functions/paginate");

module.exports = {
  name: "rider",
  description: "Lists a rider and their ratings of tracks",
  async execute(message, args) {
    try {
      const [trackName, levelFilter] = filterArgs(args);
      const riderName = await getRiderArgument(message, args);
      const riderSpecificRatings = await getRider(
        riderName,
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

      pages = toString(riderRatingsMerged, riderName);

      sendPageMessage(message, pages, 1);
      while (true) {
        try {
          let changePageNumber = await collectBasic(
            message.author,
            message,
            "```Type page numbers to display results```",
            20000,
            filterCollector
          );
          sendPageMessage(message, pages, changePageNumber);
        } catch (error) {
          console.log(error);
          break;
        }
      }
    } catch (error) {
      message.author.send("```py\n" + error.message + "\n```");
    }

    //message.author.send(toString(riderRatingsMerged, riderName) + " ```");
  },
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
      formatStringSpace(track.level_opinion, 20) +
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
  return paginate(result, /(.|\n){1,1800}\n/g, pageHeader);
};

const getRiderArgument = async (message, args) => {
  const riderArgumentFilter = (msg) => {
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
      "```Enter a rider to receive their ratings```",
      20000,
      riderArgumentFilter,
      "```fix\n No rider name received within 20 seconds. Try !rider again.\n```"
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

const filterArgs = (args) => {
  let trackName, levelFilter;
  if (args[1] === undefined) {
    trackName = undefined;
    levelFilter = undefined;
  } else if (!isNaN(Number(args[1]))) {
    trackName = undefined;
    levelFilter = args[1];
  } else if (isNaN(Number(args[1]))) {
    trackName = args[1];
    levelFilter = undefined;
  }
  return [trackName, levelFilter];
};

const filterCollector = (msg) => {
  // If message isn't from a bot user and the message can be parsed to a number (for page number)
  if (!msg.author.bot && !isNaN(Number(msg.content))) {
    // Don't accept bot messages
    return true;
  }
};
