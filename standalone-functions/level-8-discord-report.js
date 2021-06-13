const { getMedian } = require("../standalone-functions/getMedianMongo");
const { getAllRatings } = require("../standalone-functions/getAllRatingsMongo");
const { getAverage } = require("../standalone-functions/getAverageMongo");
const { getMode } = require("../standalone-functions/getModeMongo");
const cron = require("cron");
const { tracksDB } = require("../data/mongodb-utility");
const { findRatings } = require("../standalone-functions/find-ratings");
const { capitalize } = require("../standalone-functions/capitalize");
const {
  paginate,
  editPageMessage,
} = require("../standalone-functions/paginate");
const {
  formatStringSpace,
} = require("../standalone-functions/format-string-space");

const reportLevel8s = async (channel) => {
  // Send Placeholder message to be replaced with list of tracks when received later
  let message = await channel.send("PLACEHOLDER"); // Start with template message

  // Cron job to run every hour at the 0th minute and 0th second.

  new cron.CronJob(
    "0 0 */1 * * *",
    async function job() {
      await buildLevel8s(message);
    },
    () => {
      console.log("Finished Cron Job");
    },
    true,
    undefined,
    undefined,
    true // Starts job after construction
  );
};

const findPotentialLevel8s = async () => {
  averageRatings8 = await getAverage(tracksDB, "ratings", undefined, "8");
  medianRatings8 = await getMedian(tracksDB, "ratings", undefined, "8");
  modeRatings8 = await getMode(tracksDB, "ratings", undefined, "8");
  allRatings = await getAllRatings(tracksDB, "ratings");

  const level8tracks = await arrayUnique(
    averageRatings8.concat(medianRatings8).concat(modeRatings8)
  );

  const onlyTrackNamesLevel8 = [
    ...new Set(level8tracks.map((item) => item.track)),
  ];

  var potentialLevel8Tracks = [];
  for (let i = 0; i < onlyTrackNamesLevel8.length; i++) {
    rating = await findRatings(onlyTrackNamesLevel8[i]);
    potentialLevel8Tracks = potentialLevel8Tracks.concat(rating);
  }
  return potentialLevel8Tracks;
};

const toString = (trackList) => {
  let pageHeader =
    "```xl\n" +
    "Track             Level (Average)    Level (Median)    Level (Mode)     # of Ratings     Lowest Rating             Highest Rating\n" +
    "---------------------------------------------------------------------------------------------------------------------------------\n";
  let result = "";

  trackList.forEach((track) => {
    result +=
      capitalize(track.track) +
      //25 because that is how many whitespace characters are between the end of "track" and the beginning of "Ninja Level". Similar idea down below for "31"
      formatStringSpace(track.track, 18) +
      track.level_average +
      formatStringSpace(String(track.level_average), 19) +
      track.level_median +
      formatStringSpace(String(track.level_median), 18) +
      track.level_mode +
      formatStringSpace(String(track.level_mode), 17) +
      track.count +
      formatStringSpace(String(track.count), 17) +
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

function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

const buildLevel8s = async (message) => {
  // Start on page 1
  let pageNumber = 1;
  // Arrows for turning pages :)
  const emojiList = ["⏪", "⏩"];

  // Get list of tracks to send to discord channel
  const trackList = await findPotentialLevel8s();
  pages = await toString(trackList);

  message = await editPageMessage(message, pages, pageNumber);

  for (const emoji of emojiList) await message.react(emoji);

  const reactionCollector = await message.createReactionCollector(
    (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot
  );

  reactionCollector.on("collect", async (reaction, user) => {
    reaction.users.remove(user);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        pageNumber = pageNumber > 1 ? --pageNumber : pages.length;
        break;
      case emojiList[1]:
        pageNumber = pageNumber + 1 <= pages.length ? ++pageNumber : 1;
        break;
      default:
        break;
    }

    message = await editPageMessage(message, pages, pageNumber);
  });
};

module.exports.reportLevel8s = reportLevel8s;
