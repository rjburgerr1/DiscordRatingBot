const {
  formatStringSpace,
} = require("../standalone-functions/format-string-space");
const { capitalize } = require("../standalone-functions/capitalize");
const { tracksDB } = require("../data/mongodb-utility.js");
const { getMedian } = require("../standalone-functions/getMedianMongo");
const { getAllRatings } = require("../standalone-functions/getallRatingsMongo");
const { getAverage } = require("../standalone-functions/getAverageMongo");
const { getMode } = require("../standalone-functions/getModeMongo");
const cron = require("cron");
const level8ChannelID = "814172418922774589";

const {
  paginate,
  sendPageMessage,
} = require("../standalone-functions/paginate");

module.exports = {
  name: "level8",
  description: "Report to level 8 discord",
  async execute(message, args, client) {
    try {
      reportLevel8s(client, message);
    } catch (error) {
      console.log(error);
    }
  },
};

const reportLevel8s = async (client, message) => {
  // Fetch a channel by its id
  await client.channels.fetch(level8ChannelID);
  channel = await client.channels.cache.get(level8ChannelID);
  message.author.send(channel.name);
  const trackList = await findPotentialLevel8s();
  pages = toString(trackList);

  let scheduledMessage = new cron.CronJob("* * 0 * * *", () => {
    //Runs every hour

    for (i = 0; i < pages.length; i++) {
      sendPageMessage(message, pages, i + 1);
    }
  });

  // When you want to start it, use:
  scheduledMessage.start();
  // You could also make a command to pause and resume the job
};

const findPotentialLevel8s = async () => {
  averageRatings = await getAverage(tracksDB, "ratings", undefined, "8");
  medianRatings = await getMedian(tracksDB, "ratings");
  modeRatings = await getMode(tracksDB, "ratings");
  allRatings = await getAllRatings(tracksDB, "ratings");

  mergedArray = leftJoin(
    leftJoin(
      leftJoin(averageRatings, allRatings, "track", "track"),
      modeRatings,
      "track",
      "track"
    ),
    medianRatings,
    "track",
    "track"
  );
  return mergedArray;
};

const leftJoin = (objArr1, objArr2, key1, key2) =>
  objArr1.map((anObj1) => ({
    ...objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
    ...anObj1,
  }));

const toString = (trackList) => {
  let pageHeader =
    "```xl\n" +
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
