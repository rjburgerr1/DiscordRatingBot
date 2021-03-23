const collectBasic = async (
  channel,
  message,
  prompt,
  timeout,
  filter,
  response
) => {
  // Prompt for whichever argument is being collected
  channel.send(prompt);
  // Filter for track argument message

  try {
    const collectedMessage = await message.channel.awaitMessages(filter, {
      max: 1,
      time: timeout,
      errors: ["time"],
    });
    return collectedMessage.first().content;
  } catch (error) {
    if (response !== undefined) {
      message.author.send(response);
    }
    throw new Error("No messages collected");
  }
};

module.exports.collectBasic = collectBasic;

/*  message.author.send(
	"```No response within " +
	String(timeout).slice(0, -3) +
	" seconds. Try Again.```"
);*/
