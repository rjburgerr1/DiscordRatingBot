const { getMedian } = require("../standalone-functions/getMedianMongo");
const { getAllRatings } = require("../standalone-functions/getallRatingsMongo");
const { getAverage } = require("../standalone-functions/getAverageMongo");
const { getMode } = require("../standalone-functions/getModeMongo");
const level8ChannelID = "814172418922774589";
const cron = require("cron");
const { tracksDB } = require("../data/mongodb-utility");
const { findRatings } = require("../standalone-functions/find-ratings");
const { capitalize } = require("../standalone-functions/capitalize");
const {
  paginate,
  sendPageMessage,
  editPageMessage,
} = require("../standalone-functions/paginate");
const {
  formatStringSpace,
} = require("../standalone-functions/format-string-space");

const reportLevel8s = async (client) => {
  // Fetch a channel by its id
  channel = await client.channels.cache.get(level8ChannelID);

  // Get list of tracks to send to discord channel
  const trackList = await findPotentialLevel8s();
  pages = toString(trackList);
  // Start on page 1
  let pageNumber = 1;
  emojiList = ["⏪", "⏩"]; // Arrows for turning pages :)
  var curPage = await sendPageMessage(channel, pages, pageNumber);

  for (const emoji of emojiList) await curPage.react(emoji);

  const reactionCollector = curPage.createReactionCollector(
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
    curPage = await editPageMessage(curPage, pages, pageNumber);
  });

  let scheduledMessage = new cron.CronJob("* * 0 * * *", () => {});
  //Runs every hour

  // When you want to start it, use:
  scheduledMessage.start();

  // You could also make a command to pause and resume the job
};

const findPotentialLevel8s = async () => {
  averageRatings8 = await getAverage(tracksDB, "ratings", undefined, "8");
  medianRatings8 = await getMedian(tracksDB, "ratings", undefined, "8");
  modeRatings8 = await getMode(tracksDB, "ratings", undefined, "8");
  allRatings = await getAllRatings(tracksDB, "ratings");

  const level8tracks = arrayUnique(
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
  return paginate(result, /(.|\n){1,1700}\n/g, pageHeader);
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

module.exports.reportLevel8s = reportLevel8s;
