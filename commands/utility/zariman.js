const { fetchData } = require('../../modules/webSnatcher.mjs');
const { SlashCommandBuilder } = require('discord.js');
const MissionDetails = require('../../json/MissionDetails.json');

// async function zarimanBounty() {
//     fetchData('https://oracle.browse.wf/bounty-cycle')
//         .then(data => {
//             Output = "Zariman Bounties:\n"
//             zarimanBounty = data["bounties"]["ZarimanSyndicate"]
        
//             for (let rank = 0; rank < zarimanBounty.length; rank++) {
//                 Output += `${rank+1}: ${zarimanBounty[rank]["node"]}, ${zarimanBounty[rank]["challenge"]} \n`
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
            let Output = "Zariman Bounties:\n";
            let zarimanBounty = data["bounties"]["ZarimanSyndicate"];
        
            for (let rank = 0; rank < zarimanBounty.length; rank++) {

                let node = MissionDetails[zarimanBounty[rank]["node"]];

                Output += `${rank+1}: ${node.Name}, ${zarimanBounty[rank]["challenge"]} \n`;
            }
        
            interaction.reply(Output);
        }
        )
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        
    },
};
