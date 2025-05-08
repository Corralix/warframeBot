const fetchData = require('../../modules/webSnatcher.js');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionDetails = require('../../json/MissionDetails.json');
const wfConditionsDict = require('../../json/wfConditionsDict.json');

const commandDetails = {
    commandName: "deeparchimedea",
    description: "Displays this week's EDA/DA missions and modifiers",
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/weekly')
        .then(data => {

            let edaData = data["labConquestMissions"];
            let modifiers = [];
            let variants = [];

            for (let i = 0; i < 3; i++) {
                variants.push(edaData[i]["variant"]);
                modifiers.push(edaData[i]["conditions"]);
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

        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};