const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const Server = require('./models/server.js');

const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, PermissionFlagsBits } = require('discord.js');
const getInvasions = require('./modules/getInvasions.js');

// env implementation
const uri = process.env.DATABASE_URI;
const token = process.env.TOKEN;

const devMode = process.argv[2] == "dev"

async function connectToDatabase() {
    if (!uri) {
        console.error("MONGO_URI not found in .env file. Please add it.");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch (error) {
        console.error("Error connecting to MongoDB with Mongoose:", error);
        process.exit(1); // Exit if DB connection fails
    }
}

// --- 1. Creating/Updating a Server's Configuration (Upsert-like behavior) ---
// This function would be called, for example, when a bot joins a server or when a setting is first changed.
async function setupOrUpdateServerConfig(guildId, newSettings) {
    if (!guildId) {
        console.error("setupOrUpdateServerConfig: guildId is required.");
        return null;
    }
    try {
        // findOneAndUpdate with upsert:true will create if not found, or update if found.
        // The { new: true } option returns the modified document rather than the original.
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updatedConfig = await Server.findOneAndUpdate(
            { serverId: String(guildId) }, // Filter by serverId
            { $set: newSettings },      // Data to set/update
            options
        );
        devMode && console.log(`Configuration for server ${guildId} processed:`, updatedConfig);
        return updatedConfig;
    } catch (error) {
        devMode && console.error(`Error upserting config for server ${guildId}:`, error);
        return null;
    }
}



// --- Example Usage ---
async function main() {
    await connectToDatabase();

    // const exampleGuildId = "789012345678901234"; // A test guild ID
    // const anotherGuildId = "654321098765432100";

    // // Example 1: Initial setup or full update for a server
    // devMode && console.log("\n--- Example 1: Initial Setup / Full Update ---");
    // await setupOrUpdateServerConfig(exampleGuildId, {
    //     "invasion.channelId": "112233445566778899",
    //     "invasion.enabled": true,
    // });

    // // Example 4: Using findOrCreate (or getServerSettings helper)
    // devMode && console.log("\n--- Example 4: Get Or Create ---");
    // const settings = await getServerSettings(anotherGuildId);
    // if (settings) {
    //     devMode && console.log(`Settings for ${anotherGuildId}: Prefix is ${settings.prefix}, Invasion enabled: ${settings.invasion.enabled}`);
    //     settings.invasion.enabled = true; // Assuming a channel was set
    //     await settings.save(); // Mongoose documents have a .save() method
    //     devMode && console.log("Modified and saved settings:", settings);
    // }
}


async function disconnectFromDatabase() {
	try {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB.");
		process.exit(0);
	} catch (error) {
		console.error("Error disconnecting from MongoDB:", error);
	}
}

// Listen for termination signals
process.on("SIGINT", disconnectFromDatabase); // Catches ctrl+c event
process.on("SIGTERM", disconnectFromDatabase); // Catches "kill" command

main().catch(err => console.error("Unhandled error in main:", err));


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command); // Set a new item in the Collection
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	// if (InvasionChannelId) {
	// 	setInterval(() => {
	// 		const configJSON = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	// 		if (configJSON["isInvasionsOn"]) { // TODO: Disable and enable isInvasionsOn command
	// 			const updatedInvasionChannelId = configJSON["InvasionChannelId"];
	// 			const channelId = updatedInvasionChannelId // TODO: MAKE IT MULTI-SERVER FRIENDLY
	// 			const channel = client.channels.cache.get(channelId)
	// 			getInvasions().then(result => {
	// 				if (result["hasOrokin"]) {
	// 					channel.send("There is an Orokin invasion!"); // TODO: Mention GoodInvasions role or something
	// 				}
	// 			});
	// 		}
	// 	}, 600 * 1000);
	// }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

// Log in to Discord with your client's token
client.login(token);
