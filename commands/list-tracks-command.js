const { findRatings } = require("../standalone-functions/find-ratings");
module.exports = {
  name: "list",
  description:
    "Lists all track and their corresponding ninja levels. As well as # of ratings.",
  async execute(message, args) {
    const trackList = await findRatings(args[0]);
    message.author.send("```xl\n" + toString(trackList) + "```");
  },
};

const toString = (trackList) => {
  let result =
    "Track                    Ninja Level                    # of Ratings                    Lowest Rating                    Highest Rating\n" +
    "---------------------------------------------------------------------------------------------------------------------------------------\n";
  trackList.forEach((track) => {
    if (result.length < 1900) {
      result +=
        capitalize(track._id) +
        //25 because that is how many whitespace characters are between the end of "track" and the beginning of "Ninja Level". Similar idea down below for "31"
        formatStringSpace(track._id, 25) +
        track.level_average +
        formatStringSpace(String(track.level_average), 31) +
        track.count +
        formatStringSpace(String(track.count), 32) +
        track.lowestRating.author +
        " - " +
        track.lowestRating.minRating +
        formatStringSpace(
          track.lowestRating.author +
            " - " +
            String(track.lowestRating.minRating),
          33
        ) +
        track.highestRating.maxRating +
        " - " +
        track.highestRating.author +
        "\n";
    }
  });

  return result.trim().substring(0, 2000);
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
