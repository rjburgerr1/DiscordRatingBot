const collectBasic = async (channel, message, prompt) => {
  // Prompt for whichever argument is being collected
  channel.send(prompt);
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

module.exports.collectBasic = collectBasic;
