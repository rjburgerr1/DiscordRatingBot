const { getRider } = require("../standalone-functions/getRider");
const { collectBasic } = require("../standalone-functions/collectBasic");
module.exports = {
  name: "rider",
  description: "Lists a rider and their ratings of tracks",
  async execute(message, args) {
    const riderName = await getRiderArgument(message, args);
    const riderWithRatings = await getRider(riderName);
    message.author.send("```" + toString(riderWithRatings) + " ```");
  },
};

const toString = (documents) => {
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
  let track;
  if (args[0] === undefined) {
    track = await collectBasic(
      message.author,
      message,
      "```Enter a rider to receive their ratings```",
      20000
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
