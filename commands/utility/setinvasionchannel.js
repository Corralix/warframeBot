const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Server = require('../../models/Server.js');

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
		// --- Function to get or create server settings ---
		// This uses the static method we defined in the schema
		async function getServerSettings(guildId) {
			if (!guildId) {
				console.error("getServerSettings: guildId is required.");
				return null;
			}
			try {
				const settings = await Server.findOrCreate(String(guildId)); // Ensure guildId is a string
				return settings;
			} catch (error) {
				console.error(`Error getting/creating settings for guild ${guildId}:`, error);
				return null;
			}
		}

		async function setInvasionChannel(guildId, channelId) {
			if (!guildId) {
				console.error("setInvasionChannel: guildId is required.");
				return null;
			}
			try {
				const settingsToUpdate = {
					"invasion.channelId": channelId ? String(channelId) : null, // Store as string or null
					"invasion.enabled": !!channelId, // '!!' transforms value into boolean (True or False)
				};

				const updatedConfig = await Server.findOneAndUpdate(
					{ serverId: String(guildId) },
					{ $set: settingsToUpdate },
					{ new: true, upsert: true, setDefaultsOnInsert: true } // Upsert to create if doesn't exist
				);

				console.log(`Invasion channel for server ${guildId} set to ${channelId}. Enabled: ${!!channelId}`);
				console.log("Updated config:", updatedConfig);
				return updatedConfig;
			} catch (error) {
				console.error(`Error setting invasion channel for server ${guildId}:`, error);
				return null;
			}
		}

		const guildId = interaction.guildId;
		await getServerSettings(guildId);

		const selectedChannel = interaction.options.getChannel('channel');
		await setInvasionChannel(guildId, selectedChannel);

		await interaction.reply(`Invasion hype messages will be sent in ${selectedChannel} every 10 minutes!`);
	}
};