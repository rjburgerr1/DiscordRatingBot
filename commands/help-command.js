module.exports = {
  name: "help",
  description: "Describes how to rate tracks",
  execute(message, args) {
    if (args.length === 0) {
      message.author.send(
        "```ini\n" +
          "Commands: ---------------[optional-arguments] ------------------ Command Info \n\n" +
          "!help                   -[command-name]                        - List general commands or more info on one command\n" +
          "!rate                   -[track-name], -[ninja-level]          - Rate a track \n" +
          "!list                   -[track-name], -[ninja-level]          - list tracks and their ratings\n" +
          "!rider                  -[rider-name], -[ninja-level]          - List all of a rider's ratings \n" +
          "!report                 -[b/f]                                 - Report a bug or feature to the bot \n" +
          "!delete                 -[track-name]                          - Delete a rating that you made previously\n" +
          "!track                  -[track-name]                          - List all ratings for track name specified\n" +
          "\n[Make sure to prefix all command arguments with a hyphen '-'. E.g. !rate -luscious -8.7]" +
          "```"
      );
    } else {
      // args[0] should be command name for extra information
      helpInfo(message, args[0]);
    }
  },
};

const helpInfo = (message, commandName) => {
  switch (indexCommand(commandName)) {
    case 0:
      message.author.send(rateCommandInfo);
      break;
    case 1:
      message.author.send(listCommandInfo);
      break;
    case 2:
      message.author.send(riderCommandInfo);
      break;
    case 3:
      message.author.send(reportCommandInfo);
      break;
    case 4:
      message.author.send(deleteCommandInfo);
      break;
    case 5:
      message.author.send(trackCommandInfo);
      break;
    default:
      message.author.send("Command does not exist");
    // code block
  }
};
const commands = ["rate", "list", "rider", "report", "delete", "track"];
const indexCommand = (commandName) => {
  // If people use the standard prefix in the argument for extra command info, trim the exclamation before indexing the commandName
  if (commandName.charAt(0) === "!") commandName = commandName.slice(1);

  let index = commands.indexOf(commandName);
  return index;
};

const rateCommandInfo =
  "```asciidoc\n" +
  "Rate Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !rate submits a ninja-level rating for a track.\n" +
  "   The rating is added among a list of all ratings.\n" +
  "   This command will prompt you for a track name and ninja-level opinion if not provided.\n" +
  "[Usage]\n" +
  "   !rate [track-name] [ninja-level] - Adds a rating for the track given with the ninja-level given.\n" +
  "[Arguments]\n" +
  "   * track-name - The name of track you want to rate with a ninja-level. Will be prompted for if not entered to begin with.\n" +
  "   * ninja-level - The ninja-level rating for the track given. Ninja-levels span ratings of 1.0 - 9.0.\n" +
  "                   Any digit past the hundreths place will be truncated to the tenths place.\n" +
  "                   (E.g. 1.67 --> 1.6).\n" +
  "                   Will be prompted for if not entered to begin with.\n" +
  "```";

const listCommandInfo =
  "```asciidoc\n" +
  "List Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !list displays all tracks and their ratings currently stored within the bot.\n" +
  "   This command will prompt you for a track name and ninja-level opinion if not provided.\n" +
  "   The rating is added among a list of all ratings.\n" +
  "[Usage]\n" +
  "   !list - Lists all the tracks in the database, along with the average ninja-level, median ninja-level, mode ninja-level, lowest rating, highest rating, and number of ratings for each track\n" +
  "   !list [track-name] - Lists the track-name, average ninja-level, median ninja-level, mode ninja-level, lowest rating, highest rating, and number of ratings given for the track.\n" +
  "   !list [ninja-level] - Lists all the tracks and their average ninja-level, median ninja-level, mode ninja-level, lowest rating, highest rating with the number of ratings given for each track.\n" +
  "                         Filtered by tracks with an average rating of the ninja level you submit. (E.g. !list -7 will list tracks rated from 7-7.99).\n" +
  "                                                                                                  (E.g. !list -7.2 will list tracks rated 7.2)\n" +
  "[Arguments]\n" +
  "   * track-name - The name of track you want to rate with a ninja-level. Will be prompted for if not entered to begin with.\n" +
  "   * ninja-level - The ninja-level rating for the track given. Ninja-levels span ratings of 1.0 - 9.0.\n" +
  "                   Any digit past the hundreths place will be truncated to the tenths place.\n" +
  "                   (E.g. 1.67 --> 1.6).\n" +
  "                   Will be prompted for if not entered to begin with.\n" +
  "```";

const riderCommandInfo =
  "```asciidoc\n" +
  "Rider Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !rider displays all the tracks rated by a specific rider along with the ratings they gave the tracks. For comparison, average/median/mode ninja level,\n" +
  "       number of ratings, highest rating and lowest rating are listed. \n" +
  "   This command will prompt you for a rider's name if not provided.\n" +
  "[Usage]\n" +
  "   !rider [rider-name] - Lists all the ratings in the database added by the rider-name given.\n" +
  "   !rider [rider-name] [ninja-level] - Lists all the rating in the database added by the rider given, filtered by ninja-level.\n" +
  "                                       (E.g. !rider -rjburgerr1 -7 will list tracks rated between 7.0 - 7.99 by 'rjburgerr1').\n" +
  "                                       (E.g. !rider -rjburgerr1 -7.2 will list tracks rated 7.2 by 'rjburgerr1')\n" +
  "   !rider [rider-name] [track-name] - Lists the rating in the database added by the rider given, for the track given.\n" +
  "[Arguments]\n" +
  "   * rider-name - The name of rider you want to list tracks from.\n" +
  "   * ninja-level - filters all the ratings for the rider given by the ninja-level given.\n" +
  "   * track-name - The track to search for from the rider given.\n" +
  "```";

const reportCommandInfo =
  "```asciidoc\n" +
  "Report Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !report sends a request for a feature or a report of a bug of your choice to the bot.\n" +
  "   This command will prompt you for the report type, bug or feature, if not provided to begin with.\n" +
  "[Usage]\n" +
  "   !report [b/f] - Adds a report of bug or feature.\n" +
  "[Arguments]\n" +
  "   * b - b for Bug, states the type of report is a bug.\n" +
  "   * f - f for Feature, state the type of report is feature.\n" +
  "```";

const deleteCommandInfo =
  "```asciidoc\n" +
  "Delete Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !delete removes a rating previously made by you.\n" +
  "   This command will prompt you for the track-name, if not provided to begin with.\n" +
  "[Usage]\n" +
  "   !delete [track-name] - deletes the rating by you, for the track given. \n" +
  "[Arguments]\n" +
  "   * track-name - The track to search for the rating to delete.\n" +
  "```";

const trackCommandInfo =
  "```asciidoc\n" +
  "Track Command Information\n" +
  "------------------------\n" +
  "[Description]\n" +
  "   !track lists all ratings for a specific track.\n" +
  "   This command will prompt you for the track-name, if not provided to begin with.\n" +
  "[Usage]\n" +
  "   !track [track-name] - deletes the rating by you, for the track given. \n" +
  "[Arguments]\n" +
  "   * track-name - The track to list all ratings for.\n" +
  "```";
