require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getFissures = require('@modules/getFissures.js');

const commandDetails = {
    commandName: 'normalfissures',
    description: 'Get the current non Steel Path fissures',
    iconPath: "NORMAL_PATH.png",
    difficulty: "NORMAL"
};

const authorIcon = new AttachmentBuilder(`assets/icons/${commandDetails.iconPath}`);
const voidIcon = new AttachmentBuilder(`assets/icons/VOID_TRACES.png`);


module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        getFissures(commandDetails.difficulty).then(result => {
        
            let output = "";
            let eras = ["Lith", "Meso", "Neo", "Axi", "Requiem", "Omnia"]
            
            for (let i of eras) {
                if (result[i]) {
                    output += `__**${i}**__\n`;
                    for (let value of result[i]) {
                        output += `${"\u2800".repeat(1)}**${value["MissionType"]}  (${value["Level"]})**\n`;
                        output += `${"\u2800".repeat(1)}${value["Name"]}, ${value["Planet"]} | Expires <t:${value["Expiry"]}:R>\n\n`;
                    }
                }
            }


            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Current Fissures")
                .setAuthor({ name: commandDetails.difficulty, iconURL: `attachment://${commandDetails.iconPath}`, url: "https://oracle.browse.wf/" })
                .setThumbnail("attachment://VOID_TRACES.png")
                .addFields(
                    { name: "", value: output },
                )
                .setFooter({ text: "Lilypad 🧑‍🌾"})
                .setTimestamp();

            interaction.reply({ embeds: [embed], files: [authorIcon, voidIcon] });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            interaction.reply({ content: 'There was an error fetching the fissures data.', ephemeral: true });
        });
    },
};