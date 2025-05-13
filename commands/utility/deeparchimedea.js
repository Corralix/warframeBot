const fetchData = require('../../modules/webSnatcher.js');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionTypes = require('../../json/MissionTypes.json');
const wfConditionsDict = require('../../json/wfConditionsDict.json');

const commandDetails = {
    commandName: "deeparchimedea",
    description: "Displays this week's EDA/DA missions and modifiers",
}

const translations = {
    "DUALDEFENSE": "Mirror Defense"
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
                missions.push(edaData[i]["type"]);
            }

            let translatedMissions = [];
            for (let i = 0; i < missions.length; i++) {
                if (missions[i].toUpperCase() === "DUALDEFENSE") {
                    translatedMissions.push(translations["DUALDEFENSE"]);
                } else if (mission[i].toUpperCase() === "DEFENSE") {
                    missions[i] = "MT_" + missions[i] + "~Defense";
                } else {
                    missions[i] = "MT_" + missions[i];
                }
                translatedMissions.push(MissionTypes[missions[i]["Name"]]);
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
                translatedModifiers[i].push(translatedVariants[i]);
            }

            function fieldGenerator(missions, modifiers, debuffs) {
                let output = "";
                let rankEmoji = ["\u0031\uFE0F\u20E3", "\u0032\uFE0F\u20E3", "\u0033\uFE0F\u20E3", "\u0034\uFE0F\u20E3", "\u0035\uFE0F\u20E3", "\u0036\uFE0F\u20E3", "\u0037\uFE0F\u20E3", "\u0038\uFE0F\u20E3", "\u0039\uFE0F\u20E3"];


            }

            const murmurIcon = new AttachmentBuilder(`assets/icons/MURMUR.png`);

            const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`DEEP ARCHIMEDEA`)
                                    .setAuthor({ name: "ELITE/NORMAL", iconURL: `attachment://MURMUR.png`, url: "https://oracle.browse.wf/" })
                                    .addFields(
                                        fieldGenerator(translatedMissions, translatedModifiers, debuffs)
                                    )
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
            
                        interaction.reply({ embeds: [exampleEmbed], files: [murmurIcon] });
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};