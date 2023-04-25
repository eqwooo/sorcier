require("dotenv").config();
const { token, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.commands = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

const functionFolder = fs.readdirSync(`./src/functions`);
for (const folder of functionFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

const channel = "YOUR_CHANNEL_ID_HERE";
const keywords = [
  "quoicoubeh",
  "feur",
  "apanyan",
  "quoicoubaka",
  "apayinye",
  "tsukireuf",
];

client.on("messageCreate", (message) => {
  if (
    message.channel.id === channel &&
    keywords.some((keyword) => message.content.toLowerCase().includes(keyword))
  ) {
    message.channel.send("Nan ta gueule stp ...");
  }
});

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);
(async () => {
  await connect(databaseToken).catch(console.error);
})();
