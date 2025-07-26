require("module-alias/register");
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MissionDetails = require("@json/MissionDetails.json");
const Arbitration = require("@models/Arbitration.js");
const fs = require("fs");
const path = require("path");
const arbiLogFilePath = path.resolve(__dirname, "../../assets/arbis.txt");

const commandDetails = {
    commandName: "arbitrations",
    description: "Displays the current arbitration and following arbitration",
    thumbnailPath: "",
    factionPath: "",
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
                            faction: translatedMission["Enemy"]
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
            let faction = current.faction?.toUpperCase() || null;
            let factionPath = faction ? `assets/icons/factions/${faction}.png` : "";

            const vitusIcon = new AttachmentBuilder(`assets/icons/loot/VITUS_ESSENCE.png`);
            const factionIcon = new AttachmentBuilder(factionPath);

            const embed = new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle("ARBITRATIONS")
                            .setAuthor({ name: "ARBITRATIONS", iconURL: `attachment://VITUS_ESSENCE.png`, url: "https://browse.wf/arbys.txt" })
                            .setThumbnail(`attachment://${faction}.png`)
                            .addFields(
                                {
                                    name: "__Current Arbitration__",
                                    value: `**${current.mission}** (${current.faction})\n\u2800Expires ${endTime}`,
                                    inline: true
                                }
                            )
                            .setFooter({ text: "Lilypad 🧑‍🌾"})
                            .setTimestamp();

            if (next) {
                embed.addFields(
                    {
                        name: "", value: "", inline: false
                    },
                    {
                    name: "__Next Arbitration__",
                    value: `**${next.mission}** (${next.faction})\n\u2800Starts at <t:${next.time}:t>`,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [embed], files: [vitusIcon, factionIcon] });
        } catch (error) {
            console.error("Something went wrong with the arbitration command:", error);
            await interaction.reply({
                content: "An error occurred while fetching arbitration data.",
                ephemeral: true
            });
        }
    }
};
