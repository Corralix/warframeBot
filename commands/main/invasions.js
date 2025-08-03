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
            let allInvasions = result["output"];
            let output = "";

            for (let key in allInvasions) {
                let node = result["output"][key];
                console.log(node);
                let title = "";
                let content = "";
                if (Array.isArray(node)) {
                    if (node.length > 1) {
                        title = `**${node[0]["Reward"]} | ${node[1]["Reward"]}**\n`;
                        content = `${node[0]["Type"]} | ${node[1]["Type"]}\n`;
                        content += `${node[0]["Name"]} (${node[0]["Planet"]})\n\n`;
                    } else {
                        title = `**${node[0]["Reward"]}**\n`;
                        content = `${node[0]["Type"]}\n`;
                        content += `${node[0]["Name"]} (${node[0]["Planet"]})\n\n`;
                    }
                } else {
                    content = "Error retrieving reward and content.";
                }
                output += title + content;
            }

            // for (let [key, node] of Object.entries(result["output"])) {
            //         let title = "";
            //         let content = "";
            //         if (Array.isArray(node) && node.length > 1) {
            //             for (let i = 0; i < node.length; i++) {
            //                     title += `**${node[i]["Reward"]}`;
            //                     content += `${node[i]["Planet"]}, ${node[i]["Name"]} | ${node[i]["Type"]}`
            //                 }
            //                 title += ` | (${node[1]["Reward"]})**\n`;
            //                 content += ` | ${node[1]["Planet"]}, ${node[1]["Name"]} | ${node[1]["Type"]}`;
            //         } else {
            //                 title += `**\n`;
            //                 content += `\n\n`;
            //             }
            //             output += title + content;
            //         }

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