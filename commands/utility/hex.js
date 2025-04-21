const { fetchData } = require('../../modules/webSnatcher.mjs');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionDetails = require('../../json/MissionDetails.json');
const Challenges = require('../../json/ExportChallenges.json');
const wfDict = require('../../json/wfDict.json');

const commandDetails = {
    commandName: "hex",
    description: "Delivers all Hex Bounties",
    bountyId: "HexSyndicate",
    syndicateNameString: "The Hex"
}

const allyNames = {
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/AmirAllyAgent": "Amir",
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/AoiAllyAgent": "Aoi",
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/ArthurAllyAgent": "Arthur",
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/EleanorAllyAgent": "Eleanor",
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/LettieAllyAgent": "Lettie",
    "/Lotus/Types/Gameplay/1999Wf/ProtoframeAllies/QuincyAllyAgent": "Quincy",
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/bounty-cycle')
        .then(data => {
            let time = Math.floor(data["expiry"] / 1000);

            let timeString = `Expires at: <t:${time}:t> (<t:${time}:R>)`;
            

            let bounty = data["bounties"][commandDetails.bountyId];

            let nodeList = [];
            let challengeList = [];
        
            for (let rank = 0; rank < bounty.length; rank++) {
                let bountyRank = bounty[rank];

                let node = MissionDetails[bountyRank["node"]];

                let ally = allyNames[bountyRank["ally"]]
                let challengePath = Challenges[bountyRank["challenge"]];
                let challengeDesc = challengePath["description"];
                let challengeCount = challengePath["requiredCount"];
                let challengeTranslation = wfDict[challengeDesc];
                challengeTranslation = challengeTranslation.replace("|COUNT|", `${challengeCount}`);
                challengeTranslation = challengeTranslation.replace("|ALLY|", `${ally}`);
                challengeTranslation = challengeTranslation.replace("|OPEN_COLOR|", "");
                challengeTranslation = challengeTranslation.replace("|CLOSE_COLOR|", "");

                nodeList.push(node)
                challengeList.push(challengeTranslation);
            }

            let displayFaction = "";
            let factionIcon = {"TECHROT": "https://wiki.warframe.com/images/TechrotIcon.png?09c02","SCALDRA": "https://wiki.warframe.com/images/ScaldraIcon.png?70572"}
            if (nodeList[nodeList.length-1]["Enemy"] == "Techrot") {
                displayFaction = "TECHROT";
            } else {
                displayFaction = "SCALDRA";
            }


            function fieldGenerator(nodeList, challengeList) {
                let output = "";
                let rankEmoji = ["\u0031\uFE0F\u20E3", "\u0032\uFE0F\u20E3", "\u0033\uFE0F\u20E3", "\u0034\uFE0F\u20E3", "\u0035\uFE0F\u20E3", "\u0036\uFE0F\u20E3", "\u0037\uFE0F\u20E3", "\u0038\uFE0F\u20E3", "\u0039\uFE0F\u20E3"];

                for (let i = 0; i < nodeList.length; i++) {
                    let nodeFaction = nodeList[i]["Enemy"];
                    let nodeName = nodeList[i]["Name"];
                    let nodeType = nodeList[i]["Type"];

                    let enemy = "";
                    let distinguishNodes = ["Exterminate", "Hell-Scrub"];

                    if (nodeFaction == "Techrot" && distinguishNodes.includes(nodeList[i]["Type"])) {
                        enemy = "Techrot";
                    } else if (nodeFaction == "Scaldra" && distinguishNodes.includes(nodeList[i]["Type"])) {
                        enemy = "Scaldra"
                    }
                    
                    output += (`${rankEmoji[i]} **${nodeName}** (${enemy} ${nodeType})\n`)
                    output += (`${challengeList[i]}\n\n`);
                }

                return { name: "", value: output}
            }

            const exampleEmbed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle(commandDetails.syndicateNameString)
                        .setAuthor({ name: displayFaction, iconURL: factionIcon[displayFaction], url: "https://browse.wf/about" })
                        .setDescription(timeString)
                        .setThumbnail("https://wiki.warframe.com/images/HexIcon.png?c8c7d")
                        .addFields(
                            fieldGenerator(nodeList, challengeList)
                        )
                        .setFooter({ text: "Lilypad 🧑‍🌾"})
                        .setTimestamp();

            interaction.reply({ embeds: [exampleEmbed] });
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};
