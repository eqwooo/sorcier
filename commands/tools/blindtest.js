const blindtest = require("./blindtest.json");
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
    .setName("blindtest")
    .setDescription("Blindtest So La Lune"),

  async execute(interaction) {
    if (interaction.replied) {
      return;
    }

    // Vérification du rôle de Modération ->

    // if (
    //   !interaction.member.roles.cache.some(
    //     (role) => role.id === "1098709676247482368"
    //   )
    // ) {
    //   interaction.reply({
    //     content: "Désolé, seuls les `modo` peuvent utiliser cette commande !",
    //     ephemeral: true,
    //   });
    //   return;
    // }

    const item = blindtest[Math.floor(Math.random() * blindtest.length)];
    const questionEmbed = new EmbedBuilder()
      .setTitle("De quel morceau provient cette punchline :")
      .setDescription(`${item.questions} 🎶`)
      .setColor(0x4f6ddb);
    const timesUpEmbed = new EmbedBuilder()
      .setTitle(`Temps écoulé !`)
      .setDescription(`La réponse était : ${item.final}`)
      .setColor(0xec2b2b);
    const congratsEmbed = new EmbedBuilder()
      .addFields({ name: "La réponse était :", value: `${item.final}` })
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
            updateScoreboard(winner.username, 1);
          }
        })
        .catch(() => {
          interaction.followUp({ embeds: [timesUpEmbed] });
        });
    });
  },
};
