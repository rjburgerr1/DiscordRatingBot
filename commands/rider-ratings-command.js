const { getRider } = require("../standalone-functions/find-rider-ratings");
const { collectBasic } = require("../standalone-functions/message-collector");
const { findRatings } = require("../standalone-functions/find-ratings");
module.exports = {
  name: "rider",
  description: "Lists a rider and their ratings of tracks",
  async execute(message, args) {
    const riderName = await getRiderArgument(message, args);
    // Args[1] === level_opinion filter argument
    const riderSpecificRatings = await getRider(riderName, args[1]);
    const averageTrackRatings = await findRatings(riderName, args[1]);
    const joinedRatings = mergeArraysByTrack(
      riderSpecificRatings,
      averageTrackRatings
    );
    message.author.send("```ml\n" + toString(joinedRatings) + " ```");
  },
};

const toString = (documents) => {
  if (documents.length === 0) {
    return "Could not find any ratings matching your search criteria";
  }

  let result = "Rider - '" + documents[0].author + "'\n";
  result +=
    "--------------------------------------------------------------------------------\n";
  result +=
    "Tracks                Ninja Level (Opinion)                Ninja Level (Average)\n\n";
  documents.forEach((rating) => {
    result +=
      rating.track +
      formatStringSpace(rating.track, 22) +
      rating.level_opinion +
      formatStringSpace(rating.level_opinion, 37) +
      rating.level_average +
      "\n";
  });
  return result.trimEnd();
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
      "```No rider name received within 20 seconds. Try !rider again."
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

const mergeArraysByTrack = (riderRatings, trackRatings) => {
  let merged = [];

  for (let i = 0; i < riderRatings.length; i++) {
    merged.push({
      ...riderRatings[i],
      ...trackRatings.find(
        (itmInner) => itmInner.track === riderRatings[i].track
      ),
    });
  }
  return merged;
};
