const {
  reportLevel8s,
} = require("../standalone-functions/level-8-discord-report");
const level8ChannelID = "814172418922774589";
module.exports = {
  name: "level8",
  description: "Report to level 8 discord",
  async execute(message, args, client) {
    try {
      // Fetch a channel by its id
      const channel = await client.channels.cache.get(level8ChannelID);
      await reportLevel8s(channel);
    } catch (error) {
      console.log(error);
    }
  },
};
