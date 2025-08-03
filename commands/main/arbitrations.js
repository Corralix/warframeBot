require("module-alias/register");
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionDetails = require("@json/MissionDetails.json");
const Arbitration = require("@models/Arbitration.js");
const fs = require("fs");
const path = require("path");
const arbiLogFilePath = path.resolve(__dirname, "../../assets/arbitrations/arbis.txt");
const arbiTiers = require("@assets/arbitrations/arbiTiers.json");

const commandDetails = {
    commandName: "arbitrations",
    description: "Displays the current arbitration and following arbitration",
    thumbnailPath: "",
    factionPath: "",
};

const tierColours = {
    S: 0x0099FF,
    A: 0x00FF00,
    B: 0xFFFF00,
    C: 0xFF9000,
    F: 0xFF0000,
    UNKNOWN: 0xFF0000,
};

function binarySearch(entries, targetTimestamp, startIndex = 0) {
    let low = startIndex;
    let high = entries.length - 1;
    let lastValidIndex = -1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const entryTime = entries[mid].time;

        if (entryTime <= targetTimestamp) {
            lastValidIndex = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return lastValidIndex;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),

    async execute(interaction) {
        try {
            const currentTime = Math.floor(Date.now() / 1000);

            // Read and parse entries
            let entries;
            try {
                const text = fs.readFileSync(arbiLogFilePath, "utf-8");
                entries = text
                    .split("\n")
                    .map(line => {
                        const match = line.match(/(\d+),\s*(\S+)/);
                        if (!match) return null;
                        const translatedMission = MissionDetails[match[2]];
                        return {
                            time: parseInt(match[1], 10),
                            mission: `${translatedMission["Name"]}, ${translatedMission["Planet"]}`,
                            type: translatedMission["Type"],
                            faction: translatedMission["Enemy"],
                            tier: arbiTiers[translatedMission["Name"]] || "UNKNOWN"
                        };
                    })
                    .filter(Boolean); // Remove invalid lines
            } catch (err) {
                console.error("Failed to read arbis.txt:", err.message);
                return interaction.reply({
                    content: "Failed to load arbitration data.",
                    ephemeral: true
                });
            }

                // Load or create last known state
                const state = await Arbitration.getOrCreate();
                const startIndex = state.lastIndex || 0;

                // Binary search to find most recent arbitration
                const index = binarySearch(entries, currentTime, startIndex);

                if (index === -1) {
                    return interaction.reply({
                        content: "No arbitration data found.",
                        ephemeral: true
                    });
                }

            const current = entries[index];
            const next = entries[index + 1] || null;

            // Save index and timestamp
            state.lastIndex = index;
            state.lastTimestampChecked = currentTime;
            await state.save();

            // Build embed
            let endTime = next ? `<t:${next.time}:R>` : "Unknown";
            let faction = Array.isArray(current.faction) ? current.faction[0] : current.faction.toUpperCase();
            let factionPath = faction ? `assets/icons/factions/${faction}.png` : "assets/icons/other/LOTUS.png";
            let embedColour = tierColours[current.tier];

            const vitusIcon = new AttachmentBuilder(`assets/icons/loot/VITUS_ESSENCE.png`);
            const currentFactionIcon = new AttachmentBuilder(factionPath);
            let nextFactionIcon = new AttachmentBuilder();

            const currentArbi = new EmbedBuilder()
                            .setColor(embedColour)
                            .setTitle("__Current Arbitration__")
                            .setAuthor({ name: "ARBITRATIONS", iconURL: `attachment://VITUS_ESSENCE.png`, url: "https://browse.wf/arbys.txt" })
                            .setThumbnail(`attachment://${faction}.png`)
                            .addFields(
                                {
                                    name: "",
                                    value: `**${current.mission}** (${current.type})\nExpires ${endTime}\nTier: ${current.tier}`,
                                }
                            )
                            .setFooter({ text: "Lilypad 🧑‍🌾" })
                            .setTimestamp();

            const nextArbi = new EmbedBuilder();
            if (next) {
                embedColour = tierColours[next.tier];
                if (current.faction !== next.faction) {
                    faction = Array.isArray(next.faction) ? next.faction[0] : next.faction.toUpperCase();
                    factionPath = faction ? `assets/icons/factions/${faction}.png` : "assets/icons/other/LOTUS.png";
                    nextFactionIcon.setFile(factionPath);
                }

                nextArbi.setColor(embedColour);
                nextArbi.setThumbnail(`attachment://${faction}.png`);
                nextArbi.setTitle("__Next Arbitration__")
                nextArbi.addFields(
                    {
                    name: "",
                    value: `**${next.mission}** (${next.type})\nStarts at <t:${next.time}:t>\nTier: ${next.tier}`,
                    }
                );
                nextArbi.setFooter({ text: "Lilypad 🧑‍🌾" });
                nextArbi.setTimestamp();
            }

            await interaction.reply({ embeds: [currentArbi, nextArbi], files: [vitusIcon, currentFactionIcon, nextFactionIcon] });
        } catch (error) {
            console.error("Something went wrong with the arbitration command:", error);
            await interaction.reply({
                content: "An error occurred while fetching arbitration data.",
                ephemeral: true
            });
        }
    }
};
