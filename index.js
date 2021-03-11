const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const fs = require("fs");
var mongoUtil = require("./data/mongoUtil");

async function start() {
  // other app startup stuff...
  await mongoUtil.init();
  // other app startup stuff...
}
start().then(() => {
  client.commands = new Discord.Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
  }

  /**
   * The ready event is vital, it means that only _after_ this will your bot start reacting to information
   * received from Discord
   */
  client.on("ready", () => {
    console.log("I am ready!");
  });

  client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    if (command.args && !args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  });

  client.login(token);
});
