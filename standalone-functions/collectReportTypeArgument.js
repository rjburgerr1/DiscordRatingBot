const collectReportTypeArg = async (channel, message) => {
  channel.send("```Do you want to report a Bug or Feature?  (b/f)```");
  // Filter for track argument message
  const filter = (msg) => {
    if (
      (!msg.author.bot && msg.content.toLowerCase() === "b") ||
      msg.content.toLowerCase() === "f"
    ) {
      console.log(msg.content);
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

module.exports.collectReportTypeArg = collectReportTypeArg;
