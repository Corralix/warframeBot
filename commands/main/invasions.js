require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const getInvasions = require('@modules/getInvasions.js');

const commandDetails = {
    commandName: "invasions",
    description: "Get the current invasions",
    thumbnailPath: "assets/icons/other/INVASION.png"
}


module.exports = {
    data: new SlashCommandBuilder()
    .setName(commandDetails.commandName)
    .setDescription(commandDetails.description),
    
    async execute(interaction) {
        getInvasions().then(result => {
            let output = "";
            
            for (let [key, node] of Object.entries(result["output"])) {
                    let title = "";
                    let content = "";
                    if (Array.isArray(node) && node.length > 1) {
                        for (let i = 0; i < node.length; i++) {
                                title += `**${node[i]["Reward"]}`;
                                content += `${node[i]["Planet"]}, ${node[i]["Name"]} | ${node[i]["Type"]}`
                            }
                            title += ` | (${node[1]["Reward"]})**\n`;
                            content += ` | ${node[1]["Planet"]}, ${node[1]["Name"]} | ${node[1]["Type"]}`;
                    } else {
                            title += `**\n`;
                            content += `\n\n`;
                        }
                        output += title + content;
                    }

            const thumbnail = new AttachmentBuilder(commandDetails.thumbnailPath);
            const embed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle("Current Invasions")
                            .setAuthor({ name: "INVASIONS", url: "https://oracle.browse.wf/" })
                            .setThumbnail("attachment://INVASION.png")
                            .addFields({ name: "", value: output })
                            .setFooter({ text: "Lilypad 🧑‍🌾"})
                            .setTimestamp();

            interaction.reply({ embeds: [embed], files: [thumbnail] });
        })
    }
}