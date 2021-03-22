module.exports = {
  name: "help",
  description: "Describes how to rate tracks",
  execute(message) {
    message.author.send(
      "```ini\n" +
        "commands: --------------[optional-arguments] ------------------ Command Info \n" +
        " - !help \n" +
        " - !rate                [track-name], [ninja-level]           - Rate a track \n" +
        " - !list                [track-name], [ninja-level]           - list tracks and their ratings\n" +
        " - !rider               [rider-name], [ninja-level]           - List all of a rider's ratings \n" +
        " - !report              [b/f]                                 - Report a bug or feature to the bot \n" +
        " - !delete              [track-name]                          - Delete a rating that you made previously```"
    );
  },
};
