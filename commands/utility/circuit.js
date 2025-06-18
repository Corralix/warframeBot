// Import necessary discord.js classes, including ComponentType for collectors
const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
// Assuming webSnatcher is a simple fetch wrapper.
const fetchData = require("../../modules/webSnatcher.js");

// --- Configuration ---
const commandDetails = {
    commandName: "circuit",
    description: "Displays this week's circuit rotation and finds item locations.",
    iconPath: "DUVIRI.png"
};

// --- Static Data ---
const warframeRotations = {
    1: ["Excalibur", "Trinity", "Ember"],
    2: ["Loki", "Mag", "Rhino"],
    3: ["Ash", "Frost", "Nyx"],
    4: ["Saryn", "Vauban", "Nova"],
    5: ["Nekros", "Valkyr", "Oberon"],
    6: ["Hydroid", "Mirage", "Limbo"],
    7: ["Mesa", "Chroma", "Atlas"],
    8: ["Ivara", "Inaros", "Titania"],
    9: ["Nidus", "Octavia", "Harrow"],
    10: ["Gara", "Khora", "Revenant"],
    11: ["Garuda", "Baruuk", "Hildryn"],
};
const warframeNames = ["Excalibur", "Trinity", "Ember", "Loki", "Mag", "Rhino", "Ash", "Frost", "Nyx", "Saryn", "Vauban", 
    "Nova", "Nekros", "Valkyr", "Oberon", "Hydroid", "Mirage", "Limbo", "Mesa", "Chroma", "Atlas", "Ivara", "Inaros", "Titania", 
    "Nidus", "Octavia", "Harrow", "Gara", "Khora", "Revenant", "Garuda", "Baruuk", "Hildryn"];

const weaponRotations = {
    A: ["Braton", "Lato", "Skana", "Paris", "Kunai"],
    B: ["Boar", "Gammacor", "Angstrum", "Gorgon", "Anku"],
    C: ["Bo", "Latron", "Furis", "Furax", "Strun"],
    D: ["Lex", "Magistar", "Boltor", "Bronco", "Ceramic Dagger"],
    E: ["Torid", "Dual Toxocyst", "Dual Ichor", "Miter", "Atomos"],
    F: ["Ack & Brunt", "Soma", "Vasto", "Nami Solo", "Burston"],
    G: ["Zylok", "Sibear", "Dread", "Despair", "Hate"],
    H: ["Dera", "Sybaris", "Cestra", "Sicarus", "Okina"],
};

const weaponNames = ["Braton", "Lato", "Skana", "Paris", "Kunai", "Boar", "Gammacor", "Angstrum", "Gorgon", "Anku", "Bo", "Latron", "Furis", "Furax", "Strun", "Lex", "Magistar", "Boltor", "Bronco", "Ceramic Dagger", "Torid", "Dual Toxocyst", "Dual Ichor", "Miter", "Atomos", "Ack & Brunt", "Soma", "Vasto", "Nami Solo", "Burston", "Zylok", "Sibear", "Dread", "Despair", "Hate", "Dera", "Sybaris", "Cestra", "Sicarus", "Okina"]; 

function titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// Convert rotation and/or week between each other
function convertRotation(rotation) {
    if (isNaN(rotation)) {
        return rotation.charCodeAt() - 64;
    } else {
        return String.fromCharCode(rotation + 64);
    }
}

// Helper function to create embed fields for current rotations
function createCurrentRotationFields(warframes, weapons) {
    return [
        { name: "Warframes", value: warframes.join(" | ") },
        { name: "Incarnons", value: weapons.join(" | ") },
    ];
}

// Find the time to the targetted week from current week
function timeTillRotation(currentWeek, targetWeek, dict) {
    let deltaWeek;

    if (targetWeek >= currentWeek) {
        deltaWeek = targetWeek - currentWeek;
    } else if (targetWeek < currentWeek) {
        deltaWeek = (targetWeek + Object.keys(dict).length) - 2;
    } else {
        console.error("Problem with finding deltaWeek in Target Rotation.");
    }
    return deltaWeek;
}

// Create the future rotation for the targeted Warframe/weapon
/**
 * Generates an array of field objects representing the Warframe and Weapon (Incarnon) rotations for a target week and type.
 *
 * @param {number} targetWeek - The week number for which to calculate the target rotation.
 * @param {string} targetType - The type of rotation to target ("Warframe" or "Weapon").
 * @param {number} currentWarframeWeek - The current Warframe rotation week number.
 * @param {number} currentWeaponRotation - The current Weapon rotation week number.
 * @returns {Array<{name: string, value: string}>} An array of objects with `name` and `value` properties for Warframes and Incarnons.
 */
function createTargetRotationFields(targetWeek, targetType, currentWarframeWeek, currentWeaponRotation) {
    let targetWarframes;
    let targetWeapons;
    let warframeRotationsLength = Object.keys(warframeRotations).length;
    let weaponRotationsLength = Object.keys(weaponRotations).length;

    
    // If the target is a Warframe, calculate the corresponding week for weapons
    if (targetType === "Warframe") {
        targetWarframes = warframeRotations[targetWeek] || [];
        let deltaWeek = timeTillRotation(currentWarframeWeek, targetWeek, warframeRotations);
        // Calculate the corresponding weapon rotation, wrapping around if necessary
        if (currentWeaponRotation + deltaWeek <= weaponRotationsLength) {
            calculatedWeaponRotation = currentWeaponRotation + deltaWeek;
        } else if (currentWeaponRotation + deltaWeek > weaponRotationsLength) {
            calculatedWeaponRotation = currentWeaponRotation + deltaWeek - weaponRotationsLength;
        } else {
            console.error("Problem with finding calculatedWeaponRotation in Target Rotation.");
        }
        // Get the weapons for the calculated rotation
        targetWeapons = weaponRotations[convertRotation(calculatedWeaponRotation)] || [];

    // If the target is a Weapon, calculate the corresponding week for warframes
    } else if (targetType === "Weapon") {
        targetWeapons = weaponRotations[convertRotation(targetWeek)] || [];
        let deltaWeek = timeTillRotation(currentWeaponRotation, targetWeek, weaponRotations);
        // Calculate the corresponding warframe week, wrapping around if necessary
        if (currentWarframeWeek + deltaWeek <= warframeRotationsLength) {
            calculatedWarframeWeek = currentWarframeWeek + deltaWeek;
        } else if (currentWarframeWeek + deltaWeek > warframeRotationsLength) {
            calculatedWarframeWeek = currentWarframeWeek + deltaWeek - warframeRotationsLength;
        } else {
            console.error("Problem with finding calculatedWarframeWeek in Target Rotation.");
        }
        // Get the warframes for the calculated week
        targetWarframes = warframeRotations[calculatedWarframeWeek] || [];
    }

    return [
        {
            name: `Warframes`,
            value: targetWarframes.join(" | ")
        },
        {
            name: `Incarnons`,
            value: targetWeapons.join(" | ")
        }
    ];
}

// Helper function to create embed fields for all rotations (Warframes or Weapons)
function createAllRotationFields(rotations) {
    const output = [];
    // Check if the keys are numeric (for Warframes) or alphabetic (for Weapons)
    const isWarframeRotation = !isNaN(parseInt(Object.keys(rotations)[0], 10));

    for (const [key, value] of Object.entries(rotations)) {
        const prefix = isWarframeRotation ? "Week" : "Rotation";
        output.push({
            name: `${prefix} ${key}`,
            value: value.join(" | ")
        });
    }
    return output;
}

// Helper function to find a target item in the rotation lists
function findTargetInRotations(target, currentWarframeWeek, currentWeaponRotation) {
    let resultTargetWeek;
    let resultText;
    let resultType;
    
    // User search
    const searchTerm = target.toLowerCase();

    // If user search is a Warframe or Weapon
    if (warframeNames.includes(titleCase(target))) {
        for (const week in warframeRotations) {
            if (warframeRotations[week].some(wf => wf.toLowerCase() === searchTerm)) {
                resultTargetWeek = parseInt(week, 10);
                resultText = `**${titleCase(target)}** is available in ${timeTillRotation(currentWarframeWeek, resultTargetWeek, warframeRotations)} week(s), **Week ${week}** of the Warframe rotation.`;
                resultType = "Warframe";
                break; // Exit loop once found
            }
        }
    } else if (weaponNames.includes(titleCase(target))) {
        for (const rotation in weaponRotations) {
            if (weaponRotations[rotation].some(wp => wp.toLowerCase() === searchTerm)) {
                let numRotation = convertRotation(rotation);
                resultTargetWeek = numRotation;
                resultText = `**${titleCase(target)}** is available in ${timeTillRotation(currentWeaponRotation, resultTargetWeek, weaponRotations)} week(s), **Rotation ${rotation}** of the Incarnon rotation.`;
                resultType = "Weapon";
                break; // Exit loop once found
            }
        }
    } else {
        resultText = `Could not find **${titleCase(target)}** in any of the rotations. Please check your spelling.`;
    }
    return result = { text: resultText, targetWeek: resultTargetWeek, targetType: resultType }
}


// --- Slash Command Export ---
module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description)
        .addStringOption(option =>
            option.setName("target")
            .setDescription("Find a specific weapon or warframe in the rotations")
            .setRequired(false)
        ),

    async execute(interaction) {
        // Defer the reply immediately. This prevents the interaction from timing out
        // if the API call is slow, and gives you more flexibility for responding.
        await interaction.deferReply();

        // Create the icon attachment once, to be used in all replies.
        const icon = new AttachmentBuilder(`assets/icons/${commandDetails.iconPath}`);
        const target = interaction.options.getString("target");

        // --- Logic for the 'target' option ---
        if (target) {
            const data = await fetchData("https://oracle.browse.wf/worldState.json");
            
            // Use Optional Chaining (?.) to prevent crashes if the API response structure changes.
            const currentWarframes = data?.EndlessXpChoices?.[0]?.Choices;
            const currentWeapons = data?.EndlessXpChoices?.[1]?.Choices;

            // Find current week
            let currentWarframeWeek;
            for (const week in warframeRotations) {
                if (warframeRotations[week].some(wf => wf === currentWarframes[0])) {
                    currentWarframeWeek = parseInt(week, 10);
                }
            }
            let currentWeaponRotation;
            for (const rotation in weaponRotations) {
                if (weaponRotations[rotation].some(wp => wp === currentWeapons[0])) {
                    currentWeaponRotation = convertRotation(rotation);
                }
            }

            const result = findTargetInRotations(target, currentWarframeWeek, currentWeaponRotation);
            const searchEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Circuit Rotation Search`)
                .setAuthor({ name: "The Circuit", url: "https://oracle.browse.wf/" })
                .setThumbnail(`attachment://${commandDetails.iconPath}`)
                .setDescription(result["text"])
                .addFields(createTargetRotationFields(result["targetWeek"], result["targetType"], currentWarframeWeek, currentWeaponRotation))
                .setFooter({ text: "Lilypad 🧑‍🌾" })
                .setTimestamp();
            
            // Use editReply because we deferred earlier.
            await interaction.editReply({ embeds: [searchEmbed], files: [icon] });
            return; // End execution since we've fulfilled the request.
        }

        // --- Main Logic (No target provided) ---
        try {
            const data = await fetchData("https://oracle.browse.wf/worldState.json");
            
            // Use Optional Chaining (?.) to prevent crashes if the API response structure changes.
            const currentWarframes = data?.EndlessXpChoices?.[0]?.Choices;
            const currentWeapons = data?.EndlessXpChoices?.[1]?.Choices;

            if (!currentWarframes || !currentWeapons) {
                await interaction.editReply({ content: "Error: Could not parse the circuit data from the API. The structure may have changed." });
                return;
            }

            // --- Create Embeds ---
            const baseEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setThumbnail(`attachment://${commandDetails.iconPath}`)
                .setAuthor({ name: "The Circuit", iconURL: `attachment://${commandDetails.iconPath}`, url: "https://oracle.browse.wf/" })
                .setFooter({ text: "Lilypad 🧑‍🌾" })
                .setTimestamp();

            const embeds = [
                // Embed 0: Current Rotation
                new EmbedBuilder(baseEmbed.toJSON())
                    .setColor(0x1cd41c)
                    .setTitle("CURRENT ROTATION")
                    .addFields(createCurrentRotationFields(currentWarframes, currentWeapons)),
                // Embed 1: All Weapon Rotations
                new EmbedBuilder(baseEmbed.toJSON())
                    .setTitle("INCARNON ROTATIONS")
                    .addFields(createAllRotationFields(weaponRotations)),
                // Embed 2: All Warframe Rotations
                new EmbedBuilder(baseEmbed.toJSON())
                    .setTitle("WARFRAME ROTATIONS")
                    .addFields(createAllRotationFields(warframeRotations))
            ];
            
            // --- Create Buttons ---
            const prevButton = new ButtonBuilder().setCustomId("prev").setLabel("\u25C4").setStyle(ButtonStyle.Primary);
            const nextButton = new ButtonBuilder().setCustomId("next").setLabel("\u25BA").setStyle(ButtonStyle.Primary);
            const row = new ActionRowBuilder().addComponents(prevButton, nextButton);
            
            // Send the initial reply
            const message = await interaction.editReply({ embeds: [embeds[0]], files: [icon], components: [row] });

            // Create a component collector
            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120_000 // 2 minutes
            });

            let currentPage = 0;

            collector.on("collect", async (buttonInteraction) => {
                if (buttonInteraction.customId === 'prev') {
                    currentPage = currentPage > 0 ? currentPage - 1 : embeds.length - 1;
                } else if (buttonInteraction.customId === 'next') {
                    currentPage = (currentPage + 1) % embeds.length;
                }
                // Update the message with the new embed.
                await buttonInteraction.update({ embeds: [embeds[currentPage]] });
            });

            // On 'end', disable the buttons to show they are no longer active.
            collector.on('end', async () => {
                const disabledRow = new ActionRowBuilder().addComponents(
                    prevButton.setDisabled(true),
                    nextButton.setDisabled(true)
                );
                // Use a try-catch block in case the message was deleted before the collector ended.
                try {
                    await interaction.editReply({ components: [disabledRow] });
                } catch (error) {
                    console.error("Failed to edit message after collector timeout:", error);
                }
            });

        } catch (error) {
            console.error("Error executing circuit command:", error);
            await interaction.editReply({ content: "An unexpected error occurred while fetching data. Please try again later." });
        }
    },
};
