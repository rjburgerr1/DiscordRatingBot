const { Ratings } = require("../data/mongodb-utility");
const fs = require("fs");
const { collectBasic } = require("../standalone-functions/message-collector");

let rawdata = fs.readFileSync("./data/tracks.json");

const trackFile = JSON.parse(rawdata);

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
    /*
    // Track Rating
    let rating = args[1];
    // Boolean for whether or not the track exists in current database
    let trackExists = false;
    // Check if track exists in db
    for (i = 0; i < trackFile.tracks.length; i++) {
      if (track === trackFile.tracks[i].name) {
        trackExists = true;
        break;
      }
    }

    // Add track to json file of tracks
    function pushTrackObject() {
      // Delete current element if author already added track once. To be replaced
      for (i = 0; i < trackFile.tracks.length; i++) {
        if (trackFile.tracks[i].author === message.author.username) {
          trackFile.tracks.splice(i, 1);
        }
      }

      var trackToPush = {};
      trackToPush["author"] = message.author.username; // Add author for reference later
      trackToPush["name"] = track; // Add track name to object that will be added to file
      trackToPush["rating"] = rating; // Add rating to object that will be added to file

      // Add new track to existing list object
      trackFile.tracks.push(trackToPush);
      fs.writeFile(
        "./data/tracks.json",
        JSON.stringify(trackFile),
        function (err) {
          if (err) return console.log(err);
        }
      );
    }

    if (trackExists) {
      createRatingDocument({ item: "card", qty: 15 });
      message.author.send("```" + track + " is included in database```");
      pushTrackObject();
    } else {
      createRatingDocument({ item: "card", qty: 15 });
      message.author.send(
        "```Track does not exist in current list. Are you sure you want to add it? (y/n)```"
      );

      // `m` is a message object that will be passed through the filter function
      const filter = (msg) => {
        if (msg.content.toUpperCase() === "Y") {
          message.author.send("Adding track to list");
          return true;
        } else if (msg.content.toUpperCase() === "N") {
          message.author.send("Retry the !add command");
          return false;
        }
      };
      const collector = message.channel.createMessageCollector(filter, {
        time: 15000,
      });

      collector.on("collect", (msg) => {
        pushTrackObject();
        console.log(`Collected ${msg.content}`);
      });

      collector.on("end", (collected) => {
        console.log(`Collected ${collected.size} items`);
      });
    }

    serveData.editTracksMessage("815340873469788161", discordClient);
    /*
    if ((args) => {}) {
      message.channel.messages
        .fetch("814203459951263754")
        .then((message) => message.channel.send("a new message"))
        .catch(console.error);
    }

    message.channel.send(
      `Arguments: ${args}\nArguments length: ${args.length}`
    );
	*/
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
