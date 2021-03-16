const { getRider } = require("../standalone-functions/find-rider-ratings");
const { collectBasic } = require("../standalone-functions/message-collector");
module.exports = {
  name: "rider",
  description: "Lists a rider and their ratings of tracks",
  async execute(message, args) {
    const riderName = await getRiderArgument(message, args);
    // Args[1] === level_opinion filter argument
    const riderWithRatings = await getRider(riderName, args[1]);
    message.author.send("```" + toString(riderWithRatings) + " ```");
  },
};

const toString = (documents) => {
  if (documents.length === 0) {
    return "Could not find any ratings matching your search criteria";
  }
  let result = "       Rider - " + documents[0].author + "\n";
  result += "------------------------------------------- \n";
  result += "Tracks                Ninja Level (Opinion) \n\n";
  documents.forEach((rating) => {
    result +=
      rating.track +
      formatStringSpace(rating.track, 22) +
      rating.level_opinion +
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
      riderArgumentFilter
    );
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};

const formatStringSpace = (string, whitespace) => {
  let result = "";
  for (i = 0; i < whitespace - string.length; i++) {
    result += " ";
  }
  return result;
};
