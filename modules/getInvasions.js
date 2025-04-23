const fetchData = require('./webSnatcher.js');
const MissionDetails = require('../json/MissionDetails.json');
const wfDict = require('../json/wfDict.json');
const ExportRecipes = require('../json/ExportRecipes.json');
const ExportWeapons = require('../json/ExportWeapons.json');
const ExportResources = require('../json/ExportResources.json');

function getInvasions() {
    return fetchData('https://oracle.browse.wf/invasions')
        .then(data => {
            const allMissions = data["invasions"];
            let invasionRefresh = data["expiry"];
            let output = {};
            let hasOrokin = false;
            allMissions.forEach(mission => {
                let missionInternalName = mission["node"];
                let missionType = mission["missions"][0];
                let rewardPath = mission["allyPay"][0]["ItemType"];
                let rewardCount = mission["allyPay"][0]["ItemCount"];

                let rawReward = "";
                let missionReward = "";
                if (ExportRecipes[rewardPath]) {
                    rawReward = ExportRecipes[rewardPath]["resultType"];
                    weaponReward = ExportWeapons[rawReward]["name"];
                    missionReward = wfDict[weaponReward];
                    missionReward += " Blueprint";
                } else if (ExportWeapons[rewardPath]) {
                    rawReward = ExportWeapons[rewardPath]["name"];
                    missionReward = wfDict[rawReward];
                } else if (ExportResources[rewardPath]) {
                    rawReward = ExportResources[rewardPath]["name"];
                    missionReward = wfDict[rawReward];
                }

                if (missionReward === "Orokin Reactor" || missionReward === "Orokin Catalyst") {
                    hasOrokin = true;
                }
                
                let missionNode = MissionDetails[missionInternalName];
                let missionPlanet = missionNode["Planet"];
                let missionName = missionNode["Name"];

                temp = {
                    "Name": missionName,
                    "Type": missionType,
                    "Reward": missionReward,
                    "temp": rewardPath,
                    "Planet": missionPlanet,
                    "RewardCount": rewardCount
                }

                output[missionName] = output[missionName] ?? [];
                output[missionName].push(temp);
            });
            let Result = {"output": output, "hasOrokin": hasOrokin};
            return Result;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return "error";
        });
}

module.exports = getInvasions;

// getInvasions().then(result => {
//     console.log(result["output"]);
//     console.log(result["hasOrokin"]);
// });

/*

            Lex, Ceres
          Sabotage | Exterminate
        Snipetron | Ignis

        Titan, Saturn
            Exterminate
            Ignis
*/

/* 

temp = {
    "Lex": [{
        "Name": "Lex",
        "Type": "Sabotage",
        "Reward": "Snipetron",
        "Planet": "Ceres"
    },
    {
        "Name": "Lex",
        "Type": "Exterminate",
        "Reward": "Ignis",
        "Planet": "Titan"
    }],
    "Titan": [{
        "Name": "Titan",
        "Type": "Exterminate",
        "Reward": "Snipetron",
        "Planet": "Ceres"
    }]
}

*/