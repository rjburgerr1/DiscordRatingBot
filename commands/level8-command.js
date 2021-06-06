const {
  reportLevel8s,
} = require("../standalone-functions/level-8-discord-report");
module.exports = {
  name: "level8",
  description: "Report to level 8 discord",
  async execute(message, args, client) {
    try {
      reportLevel8s(client, message);
    } catch (error) {
      console.log(error);
    }
  },
};
