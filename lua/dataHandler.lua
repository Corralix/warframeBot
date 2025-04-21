-- Only if we want to do everything through Lua instead of JS
local MissionData = require('./lua/missionNodeData')

-- Note that all values from MissionData.by.Key.["SearchTerm"] will be table types
local test = MissionData.by.InternalName["SolNode801"]
print(test)
