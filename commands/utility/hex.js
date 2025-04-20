const { fetchData } = require('../../modules/webSnatcher.mjs');
const { SlashCommandBuilder } = require('discord.js');
const MissionDetails = require('../../json/MissionDetails.json');

// https://browse.wf/warframe-public-export-plus/dict.en.json
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hex')
        .setDescription('Delivers all Hex Bounties'),
    async execute(interaction) {
        fetchData('https://oracle.browse.wf/bounty-cycle')
        .then(data => {
            let Output = "The Hex:\n";
            let bounty = data["bounties"]["HexSyndicate"];
        
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