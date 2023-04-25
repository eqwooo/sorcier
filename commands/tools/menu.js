const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reseaux")
    .setDescription("Affiche les réseaux de So La Lune"),

  async execute(interaction, client) {
    if (interaction.replied) {
      return;
    }
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`sub-menu`)
      .setPlaceholder("Les réseaux de So")
      .addOptions(
        new StringSelectMenuOptionBuilder({
          label: "Instagram",
          description: "Lien vers le compte Insta",
          value: "https://www.instagram.com/so.lalune/",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Linktree",
          description: "Où écouter So La Lune ?",
          value: "https://linktr.ee/so.lune",
        }),
        new StringSelectMenuOptionBuilder({
          label: "YouTube",
          description: "Lien vers la chaine YouTube",
          value: "https://www.youtube.com/@SoLaLune",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Twitter",
          description: "Lien vers le Twitter",
          value: "https://twitter.com/solaluneoff",
        }),
        new StringSelectMenuOptionBuilder({
          label: "Shop",
          description: "Accès au shop de So La Lune",
          value: "https://www.solalune.shop/",
        })
      );

    const row = new ActionRowBuilder().addComponents(menu);
    await interaction.reply({
      content: "Choisis un truc",
      components: [row],
    });
  },
};
