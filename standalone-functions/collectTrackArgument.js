const collectTrackArg = async (channel, message, commandType) => {
  channel.send(
    "```Type the name of the track that you want to " + commandType + ".```"
  );
  // Filter for track argument message
  const filter = (msg) => {
    if (!msg.author.bot) {
      // Don't accept bot messages
      return true;
    }
  };
  const collectedMessage = await message.channel.awaitMessages(filter, {
    max: 1,
    time: 15000,
    errors: ["time"],
  });
  return collectedMessage.first().content;
};

module.exports.collectTrackArg = collectTrackArg;
