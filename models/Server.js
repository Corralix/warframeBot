const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    serverId: { // This is your guild_id
        type: String,
        required: true,
        unique: true, // Ensures one configuration document per Discord server
        index: true, // Good for query performance on this key field
    },
    invasion: { // Grouping invasion-related settings
        channelId: {
            type: String,
            required: false, // It's an optional feature
            default: null, // Use null if no channel is set
        },
        enabled: {
            type: Boolean,
            default: false, // By default, this feature might be off
        },
        pingRole: {
            type: String,
            default: null,
        }
    },
    baro: { // Grouping baro-related settings
        channelId: {
            type: String,
            required: false, // It's an optional feature
            default: null, // Use null if no channel is set
        },
        enabled: {
            type: Boolean,
            default: false, // By default, this feature might be off
        },
        pingRole: {
            type: String,
            default: null,
        }
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Method to find or create a server configuration
// This is a common pattern to ensure you always have a settings document to work with
ServerSchema.statics.findOrCreate = async function(serverId) {
    let serverConfig = await this.findOne({ serverId: serverId });
    if (!serverConfig) {
        console.log(`No config found for server ${serverId}. Creating with defaults.`);
        serverConfig = new this({ serverId: serverId }); // Defaults from schema will apply
        // You could add more complex default setup logic here if needed
        await serverConfig.save();
    }
    return serverConfig;
};


const Server = mongoose.model("Server", ServerSchema);

module.exports = Server;