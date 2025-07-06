require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetchData = require('@modules/webSnatcher.js');

const commandDetails = {
    commandName: "circuit",
    description: "Displays this week's circuit rotation",
    iconPath: "DUVIRI.png"
};

const icon = new AttachmentBuilder(`assets/icons/${commandDetails.iconPath}`);

const warframeRotations = {
    1: ["Excalibur", "Trinity", "Ember"],
    2: ["Loki", "Mag", "Rhino"],
    3: ["Ash", "Frost", "Nyx"],
    4: ["Saryn", "Vauban", "Nova"],
    5: ["Nekros", "Valkyr", "Oberon"],
    6: ["Hydroid", "Mirage", "Limbo"],
    7: ["Mesa", "Chroma", "Atlas"],
    8: ["Ivara", "Inaros", "Titania"],
    9: ["Nidus", "Octavia", "Harrow"],
    10: ["Gara", "Khora", "Revenant"],
    11: ["Garuda", "Baruuk", "Hildryn"],
};

const weaponRotations = {
    A: ["Braton", "Lato", "Skana", "Paris", "Kunai"],
    B: ["Boar", "Gammacor", "Angstrum", "Gorgon", "Anku"],
    C: ["Bo", "Latron", "Furis", "Furax", "Strun"],
    D: ["Lex", "Magistar", "Boltor", "Bronco", "Ceramic Dagger"],
    E: ["Torid", "Dual Toxocyst", "Dual Ichor", "Miter", "Atomos"],
    F: ["Ack & Brunt", "Soma", "Vasto", "Nami Solo", "Burston"],
    G: ["Zylok", "Sibear", "Dread", "Despair", "Hate"],
    H: ["Dera", "Sybaris", "Cestra", "Sicarus", "Okina"],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description)
        .addStringOption(option => 
            option.setName("target")
                .setDescription("The desired weapon/warframe")
                .setRequired(false)
        ),

    async execute(interaction) {
        fetchData("https://oracle.browse.wf/worldState.json")
            .then((data) => {
                let currentWarframes = data["EndlessXpChoices"]["0"]["Choices"];
                let currentWeapons = data["EndlessXpChoices"]["1"]["Choices"];

                function currentField(wfRot, wpRot) {
                    let output = [];

                    let framesTemp = "";
                    wfRot.forEach((element, i) => {
                        framesTemp += i === wfRot.length-1 ? element : element + " | ";
                    });

                    let weaponsTemp = "";
                    wpRot.forEach((element, i) => {
                        weaponsTemp += i === wpRot.length-1 ? element : element + " | ";
                    });

                    let frames = { name: "Warframes", value: framesTemp };
                    let weapons = { name: "Incarnons", value: weaponsTemp };

                    output.push(frames);
                    output.push(weapons);
                    return output;
                }

                function rotationField(rot) {
                    let output = [];
                    if (rot[1]) {
                        for (let i = 1; i <= Object.keys(rot).length; i++) {
                            let weekResults = rot[i];
                            let temp = { name: `Week ${i}`, value: `${weekResults[0]} | ${weekResults[1]} | ${weekResults[2]}` };
                            output.push(temp);
                        }
                    } else {
                        for (let i = 0; i < Object.keys(rot).length; i++) {
                            let rotationKey = String.fromCharCode(65+i);
                            let weekResults = rot[rotationKey];
                            let temp = { name: `Rotation ${rotationKey}`, value: `${weekResults[0]} | ${weekResults[1]} | ${weekResults[2]} | ${weekResults[3]} | ${weekResults[4]}` }
                            output.push(temp);
                        }
                    }
                    return output;
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
                
                const allFrames = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle("WARFRAME ROTATIONS")
                                    .setAuthor({ name: "The Circuit", url: "https://oracle.browse.wf/" })
                                    .setThumbnail(`attachment://${commandDetails.iconPath}`)
                                    .addFields(rotationField(warframeRotations))
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();

                const allWeapons = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle("INCARNON ROTATIONS")
                                    .setAuthor({ name: "The Circuit", url: "https://oracle.browse.wf/" })
                                    .setThumbnail(`attachment://${commandDetails.iconPath}`)
                                    .addFields(rotationField(weaponRotations))
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
                
                const currentRotation = new EmbedBuilder()
                                    .setColor(0x1cd41c)
                                    .setTitle("CURRENT ROTATION")
                                    .setAuthor({ name: "The Circuit", url: "https://oracle.browse.wf/" })
                                    .setThumbnail(`attachment://${commandDetails.iconPath}`)
                                    .addFields(currentField(currentWarframes, currentWeapons))
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
                                    
            
            interaction.reply({ embeds: [currentRotation], files: [icon], components: [row] });

            // Button interactions
            (async () => {
                const message = await interaction.fetchReply();
                const embeds = [currentRotation, allWeapons, allFrames];
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
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    },
};
