const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');

const configPath = './config.json';
const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setinvasionchannel')
		.setDescription('Set the channel for invasion messages')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to send invasion messages in')
				.setRequired(true)
		),
	async execute(interaction) {
		const selectedChannel = interaction.options.getChannel('channel');

		// Save to config
		configData["InvasionChannelId"] = selectedChannel.id;
        fs.writeFileSync(configPath, JSON.stringify(configData), 'utf-8');

		await interaction.reply(`Invasion hype messages will be sent in ${selectedChannel} every 10 minutes!`);
	}
};