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
        fetchData('https://oracle.browse.wf/worldState.json')
        .then(data => {

            

            const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`Open Worlds`)
                                    .setAuthor({ name: "World Cycle", url: "https://oracle.browse.wf/" })
                                    .addFields(
                                        fieldGenerator(translatedMissions, translatedModifiers, debuffs)
                                    )
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
            
            interaction.reply({ embeds: [exampleEmbed], files: [caviaIcon] });
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};