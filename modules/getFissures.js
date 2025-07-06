require('module-alias/register');
const fetchData = require('@modules/webSnatcher.js');
const MissionDetails = require('@json/MissionDetails.json');

const voidTiersDict = {
    "VoidT1": "Lith",
    "VoidT2": "Meso",
    "VoidT3": "Neo",
    "VoidT4": "Axi",
    "VoidT5": "Requiem",
    "VoidT6": "Omnia"
}

function getFissures(typeOfList) {
    return fetchData('https://oracle.browse.wf/worldState.json')
        .then(data => {
            let outputDict = {};
            const allFissures = data["ActiveMissions"];
            allFissures.forEach(fissure => {
                let fissureInternalName = fissure["Node"];
                let fissureNode = MissionDetails[fissureInternalName];
                let fissureName = fissureNode["Name"];

                let steelPath = fissure["Hard"] ?? false;
                let voidTier = voidTiersDict[fissure["Modifier"]];
                let expiry = Math.floor(fissure["Expiry"]["$date"]["$numberLong"] / 1000);
                let minLevel = steelPath ? parseInt(fissureNode["MinLevel"])+100 : parseInt(fissureNode["MinLevel"]);
                let maxLevel = steelPath ? parseInt(fissureNode["MaxLevel"])+100 : parseInt(fissureNode["MaxLevel"]);
                let level = `${minLevel}-${maxLevel}`;
                let missionType = `${fissureNode["Type"]}`;
                let planet = `${fissureNode["Planet"]}`;
                
                

                if (typeOfList === "STEEL PATH") {
                    if (steelPath) {
                        let temp = {
                            "Tier": voidTier,
                            "Name": fissureName,
                            "minLevel": minLevel,
                            "Expiry": expiry,
                            "Level": level,
                            "MissionType": missionType,
                            "Planet": planet,
                            "SteelPath": steelPath
                        }
                        outputDict[voidTier] = outputDict[voidTier] ?? [];
                        outputDict[voidTier].push(temp);
                    }
                } else if (typeOfList === "NORMAL") {
                    if (!steelPath) {
                        let temp = {
                            "Tier": voidTier,
                            "Name": fissureName,
                            "Expiry": expiry,
                            "minLevel": minLevel,
                            "Level": level,
                            "MissionType": missionType,
                            "Planet": planet,
                            "SteelPath": steelPath
                        }
                        
                        outputDict[voidTier] = outputDict[voidTier] ?? [];
                        outputDict[voidTier].push(temp);
                    }
                } else if (typeOfList === "ALL") {
                    let temp = {
                        "Tier": voidTier,
                        "Name": fissureName,
                        "Expiry": expiry,
                        "minLevel": minLevel,
                        "Level": level,
                        "MissionType": missionType,
                        "Planet": planet,
                        "SteelPath": steelPath
                    }

                    outputDict[voidTier] = outputDict[voidTier] ?? [];
                    outputDict[voidTier].push(temp);
                } else {
                    console.error("Invalid typeOfList argument. Use 'STEEL PATH', 'NORMAL', or 'ALL'.");
                    return;
                }
            });

            Object.entries(outputDict).forEach(([_, value]) => {
                value.sort((currentValue, nextValue) => {
                    return currentValue.minLevel - nextValue.minLevel;
                });
            });
        
            return outputDict;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return "error";
        });
}

module.exports = getFissures;
// getFissures("All").then(result => console.log(result));

// let exampleFissureList = {
//     "Axi": [
//             {
//             "Tier": "Axi",
//             "Name": "E Gate",
//             "Expiry": "17352732473",
//             "Level": "30-40",
//             "MissionType": "Disruption",
//             "Planet": "Earth",
//             "SteelPath": true
//         },
//         {
//             "Tier": "Axi",
//             "Name": "Toronto",
//             "Expiry": "17352732473",
//             "Level": "10-20",
//             "MissionType": "Survival",
//             "Planet": "Earth",
//             "SteelPath": true
//         },
//         {
//             "Tier": "Axi",
//             "Name": "E Gate",
//             "Expiry": "17352732473",
//             "Level": "50-60",
//             "MissionType": "Disruption",
//             "Planet": "Earth",
//             "SteelPath": true
//         },
//     ],

//     "Meso": [{
//         "Tier": "Meso",
//         "Name": "Toronto",
//         "Expiry": "17352732473",
//         "Level": "30-40",
//         "MissionType": "Survival",
//         "Planet": "Earth",
//         "SteelPath": true
//     }]
// }

