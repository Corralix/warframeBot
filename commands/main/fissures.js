require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const getFissures = require('@modules/getFissures.js');

const commandDetails = {
    commandName: 'fissures',
    description: 'Get all of the current fissures.',
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
            
            // Lith, Meso, Neo output
            for (let i of eras) {
                if (result[i]) {
                    output += `__**${i}**__\n`;
                    for (let value of result[i]) {
                        output += `\u2800**${value["MissionType"]}  (${value["Level"]})**\n`;
                        output += `\u2800${value["Name"]}, ${value["Planet"]} | Expires <t:${value["Expiry"]}:R>\n\n`;
                    }
                }
            }
            // Axi, Requiem, Omnia output
            for (let i of eras2) {
                if (result[i]) {
                    output2 += `__**${i}**__\n`;
                    for (let value of result[i]) {
                        output2 += `\u2800**${value["MissionType"]}  (${value["Level"]})**\n`;
                        output2 += `\u2800${value["Name"]}, ${value["Planet"]} | Expires <t:${value["Expiry"]}:R>\n\n`;
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
            
            // Setting embed1 with Lith, Meso, Neo output
            const embed1 = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Current Fissures")
                .setAuthor({ name: commandDetails.difficulty, iconURL: `attachment://${commandDetails.iconPath}`, url: "https://oracle.browse.wf/" })
                .setThumbnail("attachment://VOID_TRACES.png")
                .addFields({ name: "", value: output })
                .setFooter({ text: "page 1 | Lilypad 🧑‍🌾"})
                .setTimestamp();

            const embed2 = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Current Fissures")
                .setAuthor({ name: commandDetails.difficulty, iconURL: `attachment://${commandDetails.iconPath}`, url: "https://oracle.browse.wf/" })
                .setThumbnail("attachment://VOID_TRACES.png")
                .addFields({ name: "", value: output2 })
                .setFooter({ text: "page 2 | Lilypad 🧑‍🌾"})
                .setTimestamp();

            interaction.reply({ embeds: [embed1], files: [authorIcon, voidIcon], components: [row] });

            // Button interactions
            (async () => {
                const message = await interaction.fetchReply();
                const embeds = [embed1, embed2];
                let currentPage = 0;
                
                const collector = message.createMessageComponentCollector({ time: 120_000 });

                // Listen for button interactions
                collector.on("collect", async(buttonInteraction) => {
                    if (buttonInteraction.customId === 'prev') {
                        currentPage = (currentPage === 0) ? embeds.length - 1 : currentPage - 1;
                    } else if (buttonInteraction.customId === 'next') {
                        currentPage = (currentPage + 1) % embeds.length;
                    }
                    
                    await buttonInteraction.update({ embeds: [embeds[currentPage]] });
                })
                
                // Disable buttons after timeout
                collector.on('end', async () => {
                    const disabledRow = new ActionRowBuilder()
                    .addComponents(
                        ...row.components.map(button =>
                        ButtonBuilder.from(button).setDisabled(true)
                        )
                    );

                    await interaction.editReply({ components: [disabledRow] });
                });
            })();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            interaction.reply({ content: 'There was an error fetching the fissures data.', ephemeral: true });
        });
    },
};