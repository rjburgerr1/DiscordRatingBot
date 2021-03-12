const collectBasic = async (channel, message, prompt, timeout) => {
  // Prompt for whichever argument is being collected
  channel.send(prompt);
  // Filter for track argument message
  const filter = (msg) => {
    if (!msg.author.bot) {
      // Don't accept bot messages
      return true;
    }
  };
  try {
    const collectedMessage = await message.channel.awaitMessages(filter, {
      max: 1,
      time: timeout,
      errors: ["time"],
    });
    return collectedMessage.first().content;
  } catch (error) {
    message.author.send(
      "```No response within + " + timeout.slice(0, -3) + ". Try Again.```"
    );
  }
};

module.exports.collectBasic = collectBasic;
