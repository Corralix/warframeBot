const fetchData = require("../../modules/webSnatcher.js");
const {
    AttachmentBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");

const commandDetails = {
    commandName: "circuit",
    description:
        "Displays this week's circuit rotation and the current emotion",
};

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandDetails.commandName)
        .setDescription(commandDetails.description),

    async execute(interaction) {
        fetchData("https://oracle.browse.wf/worldState.json")
            .then((data) => {
                let currentWarframes = data["EndlessXpChoices"]["0"]["Choices"];
                let currentWeapons = data["EndlessXpChoices"]["1"]["Choices"];

                function fieldGenerator(wfRot, wpRot) {
                    let output = [];

                    for (let i = 1; i < Object.keys(wfRot).length; i++) {
                        let weekResults = wfRot[i];
                        let temp = { name: `Week ${i}`, value: `${weekResults[0]} | ${weekResults[1]} | ${weekResults[2]}` };
                        output.push(temp);
                    }

                    for (let i = 0; i < Object.keys(wpRot).length; i++) {
                        let rotationKey = String.fromCharCode(65+i);
                        let weekResults = wpRot[rotationKey];
                        let temp = { name: `Rotation ${rotationKey}`, value: `${weekResults[0]} | ${weekResults[1]} | ${weekResults[2]} | ${weekResults[3]} | ${weekResults[4]}`}
                        output.push(temp);
                    }
                    return output;
                }

                const exampleEmbed = new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle(`THE CIRCUIT`)
                                    .setAuthor({ name: "NORMAL/STEEL PATH", url: "https://oracle.browse.wf/" })
                                    .addFields(
                                        fieldGenerator(warframeRotations, weaponRotations)
                                    )
                                    .setFooter({ text: "Lilypad 🧑‍🌾"})
                                    .setTimestamp();
            
            interaction.reply({ embeds: [exampleEmbed] });
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    },
};
