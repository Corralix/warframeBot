require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchData = require('@modules/webSnatcher.js');
const wfConditionsDict = require('@json/wfConditionsDict.json');

const commandDetails = {
    commandName: "deeparchimedea",
    description: "Displays this week's EDA/DA missions and modifiers",
}

const translations = {
    "DUALDEFENSE": "Mirror Defense",
    "EXTERMINATE": "Exterminate",
    "ALCHEMY": "Alchemy",
    "ASSASSINATION": "Assassination",
    "SURVIVAL": "Survival",
    "ARTIFACT": "Disruption"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/weekly')
        .then(data => {

            let edaData = data["labConquestMissions"];
            let missions = [];
            let modifiers = [];
            let variants = [];
            
            function pascalToSpaced(arr) {
                return arr.map(str =>
                    str.replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space between lower and uppercase
                    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')); // Handle cases like "HTMLParser"
                }
            let debuffs = pascalToSpaced(data["labConquestFrameVariables"]);


            for (let i = 0; i < edaData.length; i++) {
                variants.push(edaData[i]["variant"]);
                modifiers.push(edaData[i]["conditions"]);
                missions.push(edaData[i]["type"].toUpperCase());
            }

            let translatedMissions = [];
            for (let i = 0; i < missions.length; i++) {
                    translatedMissions.push(translations[missions[i]]);
            }

            let translatedVariants = [];
            for (let i = 0; i < variants.length; i++) {
                let tempVar = wfConditionsDict[`/Lotus/Language/Conquest/MissionVariant_LabConquest_${variants[i]}`];
                translatedVariants.push(tempVar);
            }

            let translatedModifiers = [];
            for (let i = 0; i < modifiers.length; i++) {
                let tempArr = [];
                for (let j = 0; j < modifiers[i].length; j++) {
                    let tempModifier = wfConditionsDict[`/Lotus/Language/Conquest/Condition_${modifiers[i][j]}`];
                    tempArr.push(tempModifier);
                }
                translatedModifiers.push(tempArr);
            }

            for (let i = 0; i < translatedVariants.length; i++) {
                translatedModifiers[i].unshift(translatedVariants[i]);
            }

            function fieldGenerator(missions, modifiers, debuffs) {
                let output = [];
                let rankEmoji = ["\u0031\uFE0F\u20E3", "\u0032\uFE0F\u20E3", "\u0033\uFE0F\u20E3", "\u0034\uFE0F\u20E3", "\u0035\uFE0F\u20E3", "\u0036\uFE0F\u20E3", "\u0037\uFE0F\u20E3", "\u0038\uFE0F\u20E3", "\u0039\uFE0F\u20E3"];

                for (let i = 0; i < modifiers.length; i++) {
                    for (let j = 0; j < modifiers.length; j++) {
                        const modOut = { name: j == 0 ? `${rankEmoji[i]} ${missions[i]}` : "\u200B", value: `${modifiers[i][j]}`, inline: true};
                        output.push(modOut);
                    }
                }

                let debString = "";
                for (let i = 0; i < debuffs.length; i++) debString+=`${debuffs[i]}\n`;
                const debOut = { name: "\u203C\uFE0FWarframe Debuffs", value: debString.trim() };
                output.push(debOut);
                return output;
            }

            const caviaIcon = new AttachmentBuilder(`assets/icons/syndicates/CAVIA.png`);

            const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`DEEP ARCHIMEDEA`)
                                    .setAuthor({ name: "ELITE/NORMAL", iconURL: `attachment://CAVIA.png`, url: "https://oracle.browse.wf/" })
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