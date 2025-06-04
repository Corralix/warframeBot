const fetchData = require('../../modules/webSnatcher.js');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const MissionDetails = require('../../json/MissionDetails.json');
const wfDict = require('../../json/wfDict.json');
const fs = require('node:fs');
const path = require('node:path');
const getFissures = require('../../modules/getFissures.js');

const commandDetails = {
    commandName: 'allfissures',
    description: 'Get all the current fissures.',
    iconPath: "LOTUS.png",
    difficulty: "ALL"
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
            let output2 = "";
            let eras = ["Lith", "Meso", "Neo"]
            let eras2 = [ "Axi", "Requiem", "Omnia"]
            
            for (let i of eras) {
                if (result[i]) {
                    output += `__**${i}**__\n`;
                    for (let value of result[i]) {
                        output += `${"\u2800".repeat(1)}**${value["MissionType"]}  (${value["Level"]})**\n`;
                        output += `${"\u2800".repeat(1)}${value["Name"]}, ${value["Planet"]} | Expires <t:${value["Expiry"]}:R>\n\n`;
                    }
                }
            }
            for (let i of eras2) {
                if (result[i]) {
                    output2 += `__**${i}**__\n`;
                    for (let value of result[i]) {
                        output2 += `${"\u2800".repeat(1)}**${value["MissionType"]}  (${value["Level"]})**\n`;
                        output2 += `${"\u2800".repeat(1)}${value["Name"]}, ${value["Planet"]} | Expires <t:${value["Expiry"]}:R>\n\n`;
                    }
                }
            }

            // Setting interact buttons
            const prev = new ButtonBuilder()
                .setCustomId("prev")
                .setLabel("\u25C4")
                .setStyle(ButtonStyle.Primary);
            const next = new ButtonBuilder()
                .setCustomId("next")
                .setLabel("\u25BA")
                .setStyle(ButtonStyle.Primary);
            const row = new ActionRowBuilder()
                .addComponents(prev, next);
            
            // Setting initial embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Current Fissures")
                .setAuthor({ name: commandDetails.difficulty, iconURL: `attachment://${commandDetails.iconPath}`, url: "https://oracle.browse.wf/" })
                .setThumbnail("attachment://VOID_TRACES.png")
                .addFields(
                    { name: "", value: output },
                )
                .addFields(
                    { name: "", value: output2 },
                )
                .setFooter({ text: "Lilypad 🧑‍🌾"})
                .setTimestamp();

            interaction.reply({ embeds: [embed], files: [authorIcon, voidIcon], components: [row] });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            interaction.reply({ content: 'There was an error fetching the fissures data.', ephemeral: true });
        });
    },
};