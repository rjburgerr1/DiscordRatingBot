module.exports = {
  name: "help",
  description: "Describes how to rate tracks",
  execute(message, args) {
    message.author.send(
      "```To rate a track: \n type '!rate [track-name] [ninja-level]'	\n\n\n commands: *required - [optional] \n - !help \n - !rate [track-name] [ninja-level] ```"
    );
  },
};
