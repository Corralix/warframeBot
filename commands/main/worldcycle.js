require('module-alias/register');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchData = require('@modules/webSnatcher.js');

const commandDetails = {
    commandName: 'worldcycle',
    description: 'Displays the current cycles of the open worlds',
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

                let cetusCycle = { name: state(cetus) == "DAY" ? `${emojis["day"]} Plains of Eidolon` : `${emojis["night"]} Plains of Eidolon`, value: `${state(cetus)} | Expires <t:${cetusTime}:R>` };
                let venusCycle = { name: state(venus) == "COLD" ? `${emojis["cold"]} Orb Vallis` : `${emojis["warm"]} Orb Vallis`, value: `${state(venus)} | Expires <t:${venusTime}:R>` };
                let deimosCycle = { name: state(deimos) == "FASS" ? `${emojis["fass"]} Cambion Drift` : `${emojis["vome"]} Cambion Drift`, value: `${state(deimos)} | Expires <t:${deimosTime}:R>` };
                
                let earthCycle = { name: state(earth) == "DAY" ? `${emojis["day"]} Earth` : `${emojis["night"]} Earth`, value: `${state(earth)} | Expires <t:${earthTime}:R>` };

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