const { findRatings } = require("../standalone-functions/find-ratings");
const { collectBasic } = require("../standalone-functions/message-collector");
const { paginate } = require("../standalone-functions/paginate");
const { capitalize } = require("../standalone-functions/capitalize");

module.exports = {
  name: "list",
  description:
    "Lists all track and their corresponding ninja levels. As well as # of ratings.",
  async execute(message, args) {
    const [trackName, levelFilter] = filterArgs(args);

    // mongodb database query function call
    const trackList = await findRatings(trackName, levelFilter);
    // Paginate and format track list
    pages = toString(trackList);

    sendPageMessage(message, pages, 1);
    while (true) {
      try {
        let changePageNumber = await collectBasic(
          message.author,
          message,
          "```Type page number to display page of results```",
          20000,
          filterCollector
        );
        sendPageMessage(message, pages, changePageNumber);
      } catch (error) {
        console.log(error);
        break;
      }
    }
  },
};

const filterArgs = (args) => {
  let trackName, levelFilter;
  if (args.length === 2) {
    trackName = args[0];
    levelFilter = args[1];
  } else if (!isNaN(Number(args[0]))) {
    trackName = undefined;
    levelFilter = args[0];
  } else if (args[0] !== undefined) {
    trackName = args[0];
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

const sendPageMessage = (message, pages, pageNumber, pageHeader) => {
  if (pageNumber > pages.length) {
    message.author.send(
      "```diff\n- Page number Doesn't exist! Retry a new page number, or another command. -\n```"
    );
  } else {
    message.author.send(
      "```xl\n" +
        pages[pageNumber - 1] +
        "----------\nPages " +
        pageNumber +
        "/" +
        pages.length +
        "```"
    );
  }
};

const toString = (trackList) => {
  let pageHeader =
    "Track                    Level (Average)       Level (Median)       Level (Mode)         # of Ratings         Lowest Rating             Highest Rating\n" +
    "------------------------------------------------------------------------------------------------------------------------------------------------------\n";
  let result = "";

  trackList.forEach((track) => {
    result +=
      capitalize(track.track) +
      //25 because that is how many whitespace characters are between the end of "track" and the beginning of "Ninja Level". Similar idea down below for "31"
      formatStringSpace(track.track, 25) +
      track.level_average +
      formatStringSpace(String(track.level_average), 22) +
      track.level_median +
      formatStringSpace(String(track.level_median), 21) +
      track.level_mode +
      formatStringSpace(String(track.level_mode), 21) +
      track.count +
      formatStringSpace(String(track.count), 21) +
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

const formatStringSpace = (string, whitespace) => {
  let result = "";
  for (i = 0; i < whitespace - string.length; i++) {
    result += " ";
  }
  return result;
};
