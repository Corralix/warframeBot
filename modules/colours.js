const consoleColors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    brightRed: "\x1b[1;31m",
    brightGreen: "\x1b[1;32m",
    brightYellow: "\x1b[1;33m",
    brightBlue: "\x1b[1;34m",
    brightMagenta: "\x1b[1;35m",
    brightCyan: "\x1b[1;36m",
    brightWhite: "\x1b[1;37m",
    dimRed: "\x1b[2;31m",
    dimGreen: "\x1b[2;32m",
    dimYellow: "\x1b[2;33m",
    dimBlue: "\x1b[2;34m",
    dimMagenta: "\x1b[2;35m",
    dimCyan: "\x1b[2;36m",
    dimWhite: "\x1b[2;37m"
};

/**
 * Logs a message to the console with an optional color.
 *
 * @param {string} message - The message to log.
 * @param {string} [color] - The optional color name to apply to the message. 
 *                           Must correspond to a key in the `consoleColors` object.
 */
const log = (message, color) => {
    if (color && consoleColors[color]) {
        console.log(`${consoleColors[color]}${message}${consoleColors.reset}`);
    } else {
        console.log(message);
    }
}

const logError = (message) => {
    console.log(`${consoleColors.red}${message}${consoleColors.reset}`);
}

const logSuccess = (message) => {
    console.log(`${consoleColors.green}${message}${consoleColors.reset}`);
}

const logWarning = (message) => {
    console.log(`${consoleColors.yellow}${message}${consoleColors.reset}`);
}

const logInfo = (message) => {
    console.log(`${consoleColors.cyan}${message}${consoleColors.reset}`);
}

const logDebug = (message) => {
    console.log(`${consoleColors.blue}${message}${consoleColors.reset}`);
}

module.exports = {
    log,
    logError,
    logSuccess,
    logWarning,
    logInfo,
    logDebug
};