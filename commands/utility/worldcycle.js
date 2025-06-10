const fetchData = require('../../modules/webSnatcher.js');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const commandDetails = {
    commandName: 'worldcycle',
    description: 'Displays the current cycles of the open worlds.',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        fetchData('https://api.warframestat.us/PC')
        .then(data => {

            let cetus = data["cetusCycle"];
            let deimos = data["cambionCycle"];
            let venus = data["vallisCycle"];

            let earth = data["earthCycle"];

            function fieldGenerator(cetus, deimos, venus, earth) {
                let output = [];

                let time = region => Date.parse(region["expiry"].replace(/\.\d+Z$/, 'Z')) / 1000;
                let cetusTime = time(cetus);
                let deimosTime = time(deimos);
                let venusTime = time(venus);
                let earthTime = time(earth);

                let state = region => region["state"].toUpperCase();
                let emojis = {
                    day: "\u2600\uFE0F",
                    night: "\uD83C\uDF19",
                    warm: "\uD83D\uDD25",
                    cold: "\u2744\uFE0F",
                    vome: "\u2604\uFE0F",
                    fass: "\uD83D\uDCA5"
                }

                let cetusCycle = { name: "Plains of Eidolon", value: `${emojis["day"]} ${state(cetus)} | Expires <t:${cetusTime}:R>` };
                let deimosCycle = { name: "Cambion Drift", value: `${emojis["vome"]} ${state(deimos)} | Expires <t:${deimosTime}:R>` };
                let venusCycle = { name: "Orb Vallis", value: `${emojis["cold"]} ${state(venus)} | Expires <t:${venusTime}:R>` };
                
                let earthCycle = { name: "Planet Earth", value: `${emojis["night"]} ${state(earth)} | Expires <t:${earthTime}:R>` };

                output.push(cetusCycle, deimosCycle, venusCycle, earthCycle);
                return output;
            }

            const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`Open Worlds`)
                                    .setAuthor({ name: "World Cycles", url: "https://api.warframestat.us/PC/" })
                                    .addFields(
                                        fieldGenerator(cetus, deimos, venus, earth)
                                    )
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
            
            interaction.reply({ embeds: [exampleEmbed] });
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};