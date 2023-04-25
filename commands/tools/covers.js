const covers = require("./covers.json");
const { updateScoreboard } = require("./scoreboard");
const {
  SlashCommandBuilder,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");

function normalizeAnswer(answer) {
  const accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÑñ";
  const without = "AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuNn";
  const normalizedAnswer = answer
    .split("")
    .map((char) => {
      const index = accents.indexOf(char);
      return index !== -1 ? without[index] : char;
    })
    .join("")
    .toLowerCase()
    .replace(/\s+/g, "");

  return normalizedAnswer;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("covers")
    .setDescription("Devine la cover"),

  async execute(interaction) {
    if (interaction.replied) {
      return;
    }

    const cover = covers[Math.floor(Math.random() * covers.length)];
    const attachment = new AttachmentBuilder().setFile(`${cover.image}`);

    const questionEmbed = new EmbedBuilder()
      .setTitle("A quel projet / quel son correspond cette cover ? ")
      .setColor(0x4f6ddb)
      .setImage(`attachment://${cover.image}`);

    const timesUpEmbed = new EmbedBuilder()
      .setTitle(`Temps écoulé !`)
      .setDescription(`Réponse : ${cover.final}`)
      .setColor(0xec2b2b);

    const congratsEmbed = new EmbedBuilder()
      .addFields({ name: "Réponse :", value: `${cover.final}` })
      .setColor(0x65dc65);

    const filter = (response) => {
      return (
        Array.isArray(cover.reponses) &&
        cover.reponses.some((answer) => {
          return normalizeAnswer(answer) === normalizeAnswer(response.content);
        })
      );
    };

    interaction
      .reply({ embeds: [questionEmbed], files: [attachment] })
      .then(() => {
        interaction.channel
          .awaitMessages({ filter, max: 1, time: 20000, errors: ["time"] })
          .then((collected) => {
            const winner = collected.first().author;
            if (filter(collected.first())) {
              congratsEmbed
                .setTitle(`Trouvé !`)
                .setDescription(`Félicitations à ${winner}`);
              congratsEmbed.setThumbnail(winner.displayAvatarURL());
              interaction.followUp({ embeds: [congratsEmbed] });
              updateScoreboard(winner.username, 1);
            }
          })
          .catch(() => {
            interaction.followUp({ embeds: [timesUpEmbed] });
          });
      });
  },
};
