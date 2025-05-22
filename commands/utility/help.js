const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all commands for Lilypad'),
	async execute(interaction) {
        const dedent = str => {
            const match = str.match(/^[ \t]*(?=\S)/gm); // find common leading whitespace
            if (!match) return str;
            const indent = Math.min(...match.map(el => el.length));
            const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');
            return str.replace(regex, '');
        };
		await interaction.reply(dedent(`
            \`cavia\`, \`hex\`, \`zariman\` returns the current bounties for those syndicates respectively.\n
            \`allfissures\`, \`fissures\`, \`spfissures\` returns the current void fissures for those difficulties respectively.\n
            \`archon\` returns this week's Archon Shard and the missions required.\n
            \`deeparchimedea\`, \`temporalarchimedea\` returns this week's missions, conditions and debuffs for those activities respectively.
            `));
	},
};