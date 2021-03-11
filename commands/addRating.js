const { Ratings } = require("../data/mongoUtil");
const fs = require("fs");
const serveData = require("../standalone-functions/serveData");
const {
  collectTrackArg,
} = require("../standalone-functions/collectTrackArgument");
const {
  collectRatingArg,
} = require("../standalone-functions/collectRatingArgument");

let rawdata = fs.readFileSync("./data/tracks.json");

const trackFile = JSON.parse(rawdata);

module.exports = {
  name: "rate",
  description: "Add a run",
  args: false,
  async execute(message, args, discordClient) {
    // TODO add check for arg1 and arg2 and add collectors for each when not present

    const track = await getTrackArgument(message, args, discordClient);
    const rating = await getRatingArgument(message, args, discordClient);
    createRatingDocument({
      author: message.author.username,
      track: track.toLowerCase(),
      level_opinion: Number(rating),
    });
    console.log(track + " " + rating);
    message.author.send("```Are you sure you want to add this rating? (y)```");
    const filter = (msg) => {
      if (!msg.author.bot && msg.content.toLowerCase() === "y") {
        // Don't accept bot messages
        return true;
      }
    };
    const collectedMessage = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 15000,
      errors: ["time"],
    });
    console.log(collectedMessage.first().content);
    if (collectedMessage.first().content.toLowerCase() === "y") {
      createRatingDocument({
        author: message.author.username,
        track: track.toLowerCase(),
        level_opinion: Number(rating),
      });
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

async function createRatingDocument(ratingInfo) {
  const rating = await Ratings.addRating(ratingInfo);
  return rating;
}

const getTrackArgument = async (message, args, discordClient) => {
  let track;
  if (args[0] === undefined) {
    track = await collectTrackArg(message.author, message, discordClient);
  } else {
    // Track Name
    track = args[0];
  }
  return track;
};

const getRatingArgument = async (message, args, discordClient) => {
  let track;
  if (args[1] === undefined) {
    track = await collectRatingArg(message.author, message, discordClient);
  } else {
    // Track Name
    track = args[1];
  }
  return track;
};
