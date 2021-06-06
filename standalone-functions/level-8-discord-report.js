const { getMedian } = require("../standalone-functions/getMedianMongo");
const { getAllRatings } = require("../standalone-functions/getallRatingsMongo");
const { getAverage } = require("../standalone-functions/getAverageMongo");
const { getMode } = require("../standalone-functions/getModeMongo");
const level8ChannelID = "814172418922774589";
const cron = require("cron");
const { tracksDB } = require("../data/mongodb-utility");
const reportLevel8s = async (client, message) => {
  // Fetch a channel by its id
  await client.channels.fetch(level8ChannelID);

  channel = await client.channels.cache.get(level8ChannelID);
  message.author.send(channel.name);

  let scheduledMessage = new cron.CronJob("* * 0 * * *", () => {
    //Runs every hour

    message.author.send("You message");
  });

  // When you want to start it, use:
  scheduledMessage.start();
  // You could also make a command to pause and resume the job
};

const buildMessage = async () => {
  // mongodb database query function call
  const trackList = await findPotentialLevel8s(undefined, 8);
  // Paginate and format track list
  pages = toString(trackList);

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
};

const findPotentialLevel8s = async (trackName, levelFilter) => {
  allRatings = await getAllRatings(tracksDB, "ratings", trackName);
  averageRatings = await getAverage(
    tracksDB,
    "ratings",
    trackName,
    levelFilter
  );
  medianRatings = await getMedian(tracksDB, "ratings");
  modeRatings = await getMode(tracksDB, "ratings");

  let mergedArray = mergeArrays(medianRatings, allRatings);
  mergedArray = mergeArrays(modeRatings, mergedArray);

  return mergedArray;
  // Returns an array of track objects
};

module.exports.reportLevel8s = reportLevel8s;
