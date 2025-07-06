const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const colours = require('./modules/colours.js');

const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder !== 'old');

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			colours.logWarning(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {

	/**
	 * @param body list of command ID strings; empty array means non-exclusive (delete all)
	 */
	// colours.logInfo(`Started deleting ${commands.length} application / commands`);
	// rest.put(Routes.applicationCommands(clientId), { body: [] })
	// .then(() => colours.logSuccess('Successfully deleted all application commands.'))
	// .catch(colours.logError(console.error));

	try {
		colours.logInfo(`Started refreshing ${commands.length} application / commands`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		colours.logSuccess(`Successfully reloaded ${data.length} application / commands`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		colours.logError("There was an error refreshing commands : " + error);
	}
})();
