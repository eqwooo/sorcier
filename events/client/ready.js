const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          type: ActivityType.Listening,
          name: "So La Lune",
        },
      ],
      status: "idle",
    });
    console.log(`${client.user.tag} est connecté`);
  },
};
