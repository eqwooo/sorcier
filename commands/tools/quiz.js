const quiz = require("./quiz.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { updateScoreboard } = require("../tools/scoreboard");

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
    .setName("quiz")
    .setDescription("quiz So La Lune"),

  async execute(interaction) {
    if (interaction.replied) {
      return;
    }

    const item = quiz[Math.floor(Math.random() * quiz.length)];
    const questionEmbed = new EmbedBuilder()
      .setTitle("Trouves la bonne réponse :")
      .setDescription(`${item.question} 🎶`)
      .setColor(0x4f6ddb);
    const timesUpEmbed = new EmbedBuilder()
      .setTitle(`Temps écoulé !`)
      .setDescription(`Réponse : ${item.final}`)
      .setColor(0xec2b2b);
    const congratsEmbed = new EmbedBuilder()
      .addFields({ name: "Réponse :", value: `${item.final}` })
      .setColor(0x65dc65);
    const filter = (response) => {
      return (
        Array.isArray(item.reponses) &&
        item.reponses.some((answer) => {
          return normalizeAnswer(answer) === normalizeAnswer(response.content);
        })
      );
    };

    interaction.reply({ embeds: [questionEmbed] }).then(() => {
      interaction.channel
        .awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
        .then((collected) => {
          const winner = collected.first().author;
          if (filter(collected.first())) {
            congratsEmbed
              .setTitle(`Trouvé !`)
              .setDescription(`Félicitations à ${winner}`);
            congratsEmbed.setThumbnail(winner.displayAvatarURL());
            interaction.followUp({ embeds: [congratsEmbed] });

            // Mise à jour du score
            updateScoreboard(winner.username, 1);
          }
        })
        .catch(() => {
          interaction.followUp({ embeds: [timesUpEmbed] });
        });
    });
  },
};
