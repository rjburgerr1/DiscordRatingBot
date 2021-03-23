const { Ratings } = require("../data/mongodb-utility");
const { collectBasic } = require("../standalone-functions/message-collector");

module.exports = {
  name: "rate",
  description: "Add a run",
  args: false,
  async execute(message, args) {
    // TODO add check for arg1 and arg2 and add collectors for each when not present
    try {
      const track = await getTrackArgument(message, args, "rate");
      const rating = await getRatingArgument(message, args);
      message.author.send(
        "```Are you sure you want to add this rating? (y)```"
      );

      const filter = (msg) => {
        if (!msg.author.bot && msg.content.toLowerCase() === "y") {
          // Don't accept bot messages
          return true;
        }
      };
      const collectedMessage = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 20000,
        errors: ["time"],
      });
      if (collectedMessage.first().content.toLowerCase() === "y") {
        createRatingDocument(
          {
            author: message.author.username,
            track: track.toLowerCase(),
            level_opinion: Number(rating),
          },
          message
        );
      }
    } catch (error) {
      console.log(error);
      //message.author.send("```No response within 20 seconds, Try Again.```");
    }
  },
};

async function createRatingDocument(ratingInfo, message) {
  try {
    const rating = await Ratings.addRating(ratingInfo);
    message.author.send("```Added Rating!```");
    return rating;
  } catch (error) {
    console.log(error);
  }
}

const getTrackArgument = async (message, args, commandType) => {
  const trackArgumentFilter = (msg) => {
    if (!msg.author.bot) {
      return true;
    }
  };
  let track;
  if (args[0] === undefined) {
    track = await collectBasic(
      message.author,
      message,
      "```Type the name of the track that you want to " + commandType + ".```",
      20000,
      trackArgumentFilter
    );
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};

const getRatingArgument = async (message, args) => {
  const trackRatingFilter = (msg) => {
    if (
      !msg.author.bot &&
      Number(msg.content) <= 9 &&
      Number(msg.content) >= 1
    ) {
      // Don't accept bot messages
      return true;
    }
  };
  let rating;

  if (args[1] === undefined || typeof parseFloat(args[1]) !== "number") {
    //message.author.send(```Type a number for the rating (1.0-9.0```);
    rating = await collectBasic(
      message.author,
      message,
      "```Give the track a ninja rating (1.0-9.0)```",
      20000,
      trackRatingFilter
    );
  } else {
    // Rating Number
    rating = args[1];
  }
  return rating.slice(0, 3); // Truncate decimal values to prevent hilarity
};
