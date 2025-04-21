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
            console.log(bounty);

            let nodeList = [];
            let challengeList = [];
        
            for (let rank = 0; rank < bounty.length; rank++) {
                let bountyRank = bounty[rank];

                let node = MissionDetails[bountyRank["node"]];

                let challengePath = Challenges[bountyRank["challenge"]];
                let challengeDesc = challengePath["description"];
                let challengeCount = challengePath["requiredCount"];
                let challengeTranslation = wfDict[challengeDesc];
                challengeTranslation = challengeTranslation.replace("|COUNT|", `${challengeCount}`);

                nodeList.push(node)
                challengeList.push(challengeTranslation);

            }

            
            function fieldGenerator(nodeList, challengeList) {
                let output = "";
                let rankEmoji = ["\u0031\uFE0F\u20E3", "\u0032\uFE0F\u20E3", "\u0033\uFE0F\u20E3", "\u0034\uFE0F\u20E3", "\u0035\uFE0F\u20E3"];

                for (let i = 0; i < nodeList.length; i++) {
                    output += (`${rankEmoji[i]} **${nodeList[i]["Name"]}** (${nodeList[i]["Type"]})\n`)
                    output += (`${challengeList[i]}\n\n`);
                }

                return { name: "", value: output}
            }

            const exampleEmbed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle(commandDetails.syndicateNameString)
                        .setAuthor({ name: "ada", iconURL: "https://i.imgur.com/AfFp7pu.png", url: "https://browse.wf/about" })
                        .setDescription(timeString)
                        .setThumbnail("https://i.imgur.com/AfFp7pu.png")
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
