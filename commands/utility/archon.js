const fetchData = require('../../modules/webSnatcher.js');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionDetails = require('../../json/MissionDetails.json');
const MissionTypes = require('../../json/MissionTypes.json');

const commandDetails = {
    commandName: 'archon',
    description: 'Get the active Archon information this week.',
    shardPath: ["CRIMSON_SHARD.png", "AMBER_SHARD.png", "AZURE_SHARD.png"],
    archonName: ["AMAR", "NIRA", "BOREAL"],
    levels: ["130-135", "135-140", "145-150"]
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/worldState.json')
        .then(data => {

            let archonData = data["LiteSorties"][0];
            let archonName = "";
            let shard = "";
            
            for (let i = 0; i < commandDetails["archonName"].length; i++) {
                if (archonData["Boss"].includes(commandDetails["archonName"][i])) {
                    archonName = commandDetails["archonName"][i];
                    shard = commandDetails["shardPath"][i];
                }
            }

            let missions = archonData["Missions"];
            let missionList = [];
            let missionTypeList = [];
            let planet = "";

            for (let i = 0; i < missions.length; i++) {
                let node = missions[i]["node"];
                let type = missions[i]["missionType"];
                let mission = MissionDetails[node];

                let missionName = mission["Name"];
                let missionType = MissionTypes[type]["Name"];
                planet = mission["Planet"];

                missionList.push(missionName);
                missionTypeList.push(missionType);
            }

            const shardIcon = new AttachmentBuilder(`assets/icons/${shard}`);
            const archonIcon = new AttachmentBuilder(`assets/icons/NARMER.png`);

            function fieldGenerator(missionList, missionTypeList) {
                let rankEmoji = ["\u0031\uFE0F\u20E3", "\u0032\uFE0F\u20E3", "\u0033\uFE0F\u20E3", "\u0034\uFE0F\u20E3", "\u0035\uFE0F\u20E3", "\u0036\uFE0F\u20E3", "\u0037\uFE0F\u20E3", "\u0038\uFE0F\u20E3", "\u0039\uFE0F\u20E3"];
                let output = "";

                for (let i = 0; i < missionList.length; i++) {
                    output += `${rankEmoji[i]} **${missionTypeList[i]}** (${commandDetails["levels"][i]})\n`;
                    output += `${"\u2800".repeat(3)}${missionList[i]}, ${planet}\n\n`;
                }

                return { name: "", value: output};
            }

            const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`ARCHON ${archonName}`)
                                    .setAuthor({ name: "ARCHON HUNT", iconURL: `attachment://NARMER.png`, url: "https://oracle.browse.wf/" })
                                    .setThumbnail(`attachment://${shard}`)
                                    .addFields(
                                        fieldGenerator(missionList, missionTypeList)
                                    )
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
            
                        interaction.reply({ embeds: [exampleEmbed], files: [shardIcon, archonIcon] });
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};