const {
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
} = require("discord.js");
const Player = require("../../schemas/player");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scoreboard")
    .setDescription("Tableau des scores du Sorcier"),

  async execute(interaction, client) {
    if (interaction.replied) {
      return;
    }

    let playerProfile = await Player.findOneAndUpdate({
      playerId: interaction.user.id,
    });

    if (!playerProfile) {
      playerProfile = await new Player({
        _id: new mongoose.Types.ObjectId(),
        playerId: interaction.user.id,
        playerName: interaction.user.tag,
        score: 0,
      });

      await playerProfile.save().catch(console.error);
    }

    const players = await Player.find().sort({ score: -1 }).limit(10);

    if (players.length === 0) {
      await interaction.followUp({
        content: "Aucun joueur dans la base de données ...",
        ephemeral: true,
      });
    }
    const scoreEmbed = new EmbedBuilder()
      .setTitle("Tableau des scores !")
      .setDescription("Top 10 des joueurs :")
      .setColor(0xa98467)
      .setThumbnail(`${client.user.displayAvatarURL()}`);

    players.forEach((player, index) => {
      if (index + 1 === 1) {
        scoreEmbed.addFields(
          {
            name: `1er : ${player.playerName} !`,
            value: `${player.score} points`,
          },
          {
            name: "\u200B",
            value: "\u200B",
          }
        );
      } else {
        scoreEmbed.addFields({
          name: `${index + 1}e. ${player.playerName}`,
          value: `${player.score} points`,
          inline: true,
        });
      }
    });

    await interaction.reply({ embeds: [scoreEmbed], ephemeral: false });
  },

  updateScoreboard: async function (playerName, points) {
    Player.findOneAndUpdate(
      { playerName },
      { $inc: { score: points } },
      { upsert: true, new: false }
    )
      .then((player) => {
        console.log(`Score mis à jour pour ${player.playerName}`);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
