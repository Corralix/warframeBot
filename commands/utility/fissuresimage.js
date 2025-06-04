// const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
// const getFissures = require("../../modules/getFissures.js");
// const { generateFissureImage } = require("../../fkEmbeds/imageGenerator.js"); // Adjust path if needed

// const commandDetails = {
//     commandName: "fissuresimage",
//     description: "Get the current non Steel Path fissures.",
//     iconPath: "NORMAL_PATH.png",
//     difficulty: "NORMAL",
// };

// module.exports = {
//     data: new SlashCommandBuilder().setName(commandDetails.commandName).setDescription(commandDetails.description),

//     async execute(interaction) {
//         try {
//             // Defer reply if image generation might take time
//             await interaction.deferReply();

//             const fissureData = await getFissures(commandDetails.difficulty);
//             const eras = ["Lith", "Meso", "Neo", "Axi", "Requiem", "Omnia"]; // Define the order of eras

//             const imageBuffer = await generateFissureImage(fissureData, eras, commandDetails.difficulty);

//             const attachment = new AttachmentBuilder(imageBuffer, {
//                 name: `fissures-${commandDetails.difficulty.toLowerCase()}.png`,
//             });

//             await interaction.editReply({ files: [attachment] });
//         } catch (error) {
//             console.error(`Error in ${commandDetails.commandName} command:`, error);
//             const errorMessage = "There was an error generating the fissures image.";
//             if (interaction.deferred || interaction.replied) {
//                 await interaction.editReply({ content: errorMessage, ephemeral: true }).catch(console.error);
//             } else {
//                 await interaction.reply({ content: errorMessage, ephemeral: true }).catch(console.error);
//             }
//         }
//     },
// };
