module.exports = {
  name: "help",
  description: "Describes how to rate tracks",
  execute(message) {
    message.author.send(
      "```" +
        "commands: [optional] \n" +
        " - !help \n" +
        " - !rate [track-name] [ninja-level] - Rate a track \n" +
        " - !list - list tracks and their ratings" +
        " - !rider [rider-name] - List all of a rider's ratings \n" +
        " - !delete [track-name] - Delete a rating that you made previously```"
    );
  },
};
