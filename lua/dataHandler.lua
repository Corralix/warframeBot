local MissionData = require('./lua/missionNodeData')

-- Find all nodes with the Interception mission type (i.e. Type = "Interception")
-- Note that all values from MissionData.by.Key.["SearchTerm"] will be table types
local test = MissionData.by.InternalName["SolNode801"]
print(test)
