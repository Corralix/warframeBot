const { fetchData } = require('../../modules/webSnatcher.mjs');
const { SlashCommandBuilder } = require('discord.js');
const MissionDetails = require('../../json/MissionDetails.json');

// async function bounty() {
//     fetchData('https://oracle.browse.wf/bounty-cycle')
//         .then(data => {
//             Output = "Zariman Bounties:\n"
//             bounty = data["bounties"]["ZarimanSyndicate"]
        
//             for (let rank = 0; rank < bounty.length; rank++) {
//                 Output += `${rank+1}: ${bounty[rank]["node"]}, ${bounty[rank]["challenge"]} \n`
//             }
        
//             return Output;
//         }
//         )
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }


// https://browse.wf/warframe-public-export-plus/dict.en.json
module.exports = {
    data: new SlashCommandBuilder()
        .setName('zariman')
        .setDescription('Delivers all Zariman Bounties'),
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/bounty-cycle')
        .then(data => {
            let time = data["expiry"];
            let faction = data["zarimanFaction"];
            let Output = `Expires in: <t:${time}:t>\n##The Holdfasts:\n###Faction: ${faction}`;
            let bounty = data["bounties"]["ZarimanSyndicate"];
        
            for (let rank = 0; rank < bounty.length; rank++) {

                let node = MissionDetails[bounty[rank]["node"]];

                Output += `${rank+1}: ${node.Name}, ${bounty[rank]["challenge"]} \n`;
            }
        
            interaction.reply(Output);
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};
