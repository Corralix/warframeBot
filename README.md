# Warframe Bot

A Discord bot designed to provide Warframe players with real-time information about missions, bounties, fissures, and other in-game events.

## Features

- **Mission Tracking**: Provides details about active missions, including fissures, invasions, and bounties.
- **Bounty Information**: Displays current bounties for factions like Zariman, Cavia, and Hex.
- **Fissure Updates**: Tracks both Steel Path and normal Void Fissures.
- **Invasion Alerts**: Fetches and displays active invasions with rewards.

### Commands

- `/setinvasionchannel`: Sets the channel for invasion updates.

### Utility Commands

- `/help`: Provides all current usable commands for the bot.
- `/fissures`: Provides current non-Steel Path fissures.
- `/spfissures`: Provides current Steel Path fissures.
- `/allfissures`: Provides all fissures, including Steel Path and non-Steel Path.
- `/zariman`: Provides Zariman bounty details.
- `/cavia`: Provides Cavia bounty details.
- `/hex`: Provides Hex bounty details.
- `/archon`: Provides the week's Archon Hunt details.
- `/deeparchimedea`: Provides the week's Deep Archimedea missions and modifiers, Elite and Normal.
- `/temporalarchimedea`: Provides the week's Temporal Archimedea missions and modifiers, Elite and Normal.
- `/circuit`: Provides the week's circuit rotation as well as the entire list.
- `/worldcyle`: Provides the current day cycles of all open worlds (PoE, Orb Vallis, Cambion Drift, and Earth)

## How to run/test

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/warframeBot.git
   ```

2. Edit the `config.json` file with your Discord bot token and other settings

3. Install the required packages:

   ```bash
   npm install discord.js
   ```

4. Deploy commands to your server:

   ```bash
   node deploy-commands.js
   ```

5. Start the bot:
   ```bash
    node index.js
   ```

### Packages required

- discord.js

## Planned Features

- **Alerts**: Notifications for Gift of the Lotus alerts and other time-sensitive events.
- **Void Storms** (is in VoidStorms WorldState JSON)
- Baro Ki'Teer (next visit and items)
- Teshin (Weekly item)

## TODO

- Incorporate an optional "weapon/frame" argument to `circuit` command to inform users when that rotation will be available.
- Add a clock to `worldcycle` command to alert (@customrole) users of rarer times (eg. night on Cetus)
- Add an alert (@customrole) to invasions so users know when there are good invasions (eg. orokin potatoes) 