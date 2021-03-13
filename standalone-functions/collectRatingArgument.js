const collectRatingArg = async (channel, message, client) => {
  channel.send("```Give the track a ninja rating (1.0-9.0)```");
  // Filter for track argument message
  const filter = (msg) => {
    if (
      !msg.author.bot &&
      Number(msg.content) <= 9 &&
      Number(msg.content) >= 1
    ) {
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

module.exports.collectRatingArg = collectRatingArg;
