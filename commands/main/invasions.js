require('module-alias/register');
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const getInvasions = require('@modules/getInvasions.js');

const commandDetails = {
    commandName: "invasions",
    description: "Get the current invasions"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),
        
    async execute(interaction) {
        getInvasions().then(result => {
            let output = "";


        })
    }
}