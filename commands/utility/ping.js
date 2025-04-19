const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); // https://discordjs.guide/popular-topics/embeds.html#embed-preview

module.exports = {
	data: new SlashCommandBuilder().setName("emb").setDescription("Embed example"),
	async execute(interaction) {
		// inside a command, event listener, etc.
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle("Some title")
			.setURL("https://discord.js.org/")
			.setAuthor({ name: "Some name", iconURL: "https://i.imgur.com/AfFp7pu.png", url: "https://discord.js.org" })
			.setDescription("Some description here")
			.setThumbnail("https://i.imgur.com/AfFp7pu.png")
			.addFields(
				{ name: "Regular field title", value: "Some value here" },
				{ name: "\u200B", value: "\u200B" },
				{ name: "Inline field title", value: "Some value here", inline: true },
				{ name: "Inline field title", value: "Some value here", inline: true }
			)
			.addFields({ name: "Inline field title", value: "Some value here", inline: true })
			.setImage("https://i.imgur.com/AfFp7pu.png")
			.setTimestamp()
			.setFooter({ text: "Some footer text here", iconURL: "https://i.imgur.com/AfFp7pu.png" });

		// channel.send({ embeds: [exampleEmbed] });
		await interaction.reply({ embeds: [exampleEmbed] });
	},
};
