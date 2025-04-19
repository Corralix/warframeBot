--- Utility module containing helper functions for table and string operations.
-- @module utils
local H = {}

--- Checks if a table contains a specific value.
-- @param table The table to search.
-- @param value The value to look for.
-- @return boolean True if the value is found in the table, false otherwise.
function H.tableContains(table, value)
    for i = 1, #table do
        if (table[i] == value) then
            return true
        end
    end
    return false
end

--- Concatenates the contents of one table to another.
-- @param t1 The first table to which the contents of the second table will be added.
-- @param t2 The second table whose contents will be appended to the first table.
-- @return table The modified first table with the contents of the second table appended.
function H.tableConcat(t1, t2)
    for i = 1, #t2 do
        t1[#t1 + 1] = t2[i]
    end
    return t1
end

--- Writes a string to a file in a specified directory with a given name.
-- @param stringToWrite The string to write to the file.
-- @param fileName The name of the file (without extension).
-- @param fileDirectory The directory where the file will be created.
function H.stringToFile(stringToWrite, fileName, fileDirectory)
    local filePath = fileDirectory .. fileName .. ".json"
    local file = io.open(filePath, "w")
    if file then
        file:write(stringToWrite)
        file:close()
    end
end

return H
