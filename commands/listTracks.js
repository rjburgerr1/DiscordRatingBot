const { calculateLevels } = require("../standalone-functions/calculateLevels");
module.exports = {
  name: "list",
  description:
    "Lists all track and their corresponding ninja levels. As well as # of ratings.",
  async execute(message, args) {
    const trackList = await calculateLevels();

    message.author.send("```" + toString(trackList) + " ```");
  },
};

const toString = (trackList) => {
  let result =
    "Track                    Ninja Level                    # of Ratings \n" +
    "-------------------------------------------------------------------- \n";
  trackList.forEach((track) => {
    result +=
      capitalize(track._id) +
      //25 because that is how many whitespace characters are between the end of "track" and the beginning of "Ninja Level". Similar idea down below for "31"
      formatStringSpace(track._id, 25) +
      track.level_average +
      formatStringSpace(String(track.level_average), 31) +
      track.count +
      "\n";
  });
  return result.trim();
};

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatStringSpace = (string, whitespace) => {
  let result = "";
  for (i = 0; i < whitespace - string.length; i++) {
    result += " ";
  }
  return result;
};
