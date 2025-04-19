local MissionData = require('./lua/missionNodeData')
-- https://wiki.warframe.com/w/Module:Missions/data
local utils = require('./lua/module/utils')

local nonInternalNames = { "", "ToggleBootLevel" }

function MissionDetails(infoType)
    local arrayOfKeys = {}
    local jsonOutputArray = { '{\n' }
    for _, mission in pairs(MissionData[infoType]) do
        mission.InternalName = mission.InternalName or ""
        local missionName
        if utils.tableContains(nonInternalNames, mission.InternalName) then
            missionName = mission.Name
        else
            missionName = mission.InternalName
        end
        -- Check if the mission name is already in the array of keys
        if utils.tableContains(arrayOfKeys, missionName) then
            missionName = missionName .. "~" .. mission.Name -- TODO: better way to handle this
        end
        utils.tableConcat(jsonOutputArray, { '\t', '"', missionName, '"', ':', ' ', '', '{', '\n' })
        table.insert(arrayOfKeys, missionName)
        for missionKey, missionValue in pairs(mission) do
            BooleanValuePlaceholder = "true"
            -- If the value is a boolean, add it to the string as a string
            if type(missionValue) == "boolean" then
                if missionValue == true then
                    BooleanValuePlaceholder = "true"
                else
                    BooleanValuePlaceholder = "false"
                end
                utils.tableConcat(jsonOutputArray,
                    { '\t\t"', missionKey, '": "', BooleanValuePlaceholder, '"', ',', '\n' })
            elseif type(missionValue) == "table" then -- If the value is a table, iterate through the table and add each value to the string
                utils.tableConcat(jsonOutputArray, { '\t\t"', missionKey, '"', ':', ' ', '[' })
                for i, listedValue in ipairs(missionValue) do
                    utils.tableConcat(jsonOutputArray, { '"', listedValue, '"' })
                    if i ~= #missionValue then
                        table.insert(jsonOutputArray, ',')
                    end
                end
                utils.tableConcat(jsonOutputArray, { ']', ',', '\n' })
            else                                               -- If the value is a string, add it to the string as is
                NewLineIndex = string.find(missionValue, "\n") -- Check if the string contains a newline character
                if NewLineIndex then
                    utils.tableConcat(jsonOutputArray, { '\t\t"', missionKey, '"', ':', ' ', '[' })
                    for splitMissionValue in string.gmatch(missionValue, "[^\n]+") do
                        utils.tableConcat(jsonOutputArray, { '"', splitMissionValue, '"', ',' })
                    end
                    if #missionValue > 0 then
                        table.remove(jsonOutputArray, #jsonOutputArray) -- remove last comma
                    end
                    utils.tableConcat(jsonOutputArray, { ']', ',', '\n' })
                else
                    utils.tableConcat(jsonOutputArray,
                        { '\t', '\t"', missionKey, '"', ':', ' ', '"', missionValue, '"', ',', '\n' })
                end
            end
        end

        table.remove(jsonOutputArray, #jsonOutputArray) -- remove last newline
        table.remove(jsonOutputArray, #jsonOutputArray) -- remove last comma
        utils.tableConcat(jsonOutputArray, { '\n', '\t', '}', ',', '\n' })
    end
    table.remove(jsonOutputArray, #jsonOutputArray) -- remove last newline
    table.remove(jsonOutputArray, #jsonOutputArray) -- remove last comma
    utils.tableConcat(jsonOutputArray, { '\n', '}', '\n' })
    return (table.concat(jsonOutputArray))
end

utils.stringToFile(MissionDetails("MissionDetails"), "MissionDetails", "./json/") -- for testing purposes only
