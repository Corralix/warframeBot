# Warframe Bot

A Discord bot designed to provide Warframe players with real-time information about missions, bounties, fissures, and other in-game events.

## Features

- **Mission Tracking**: Provides details about active missions, including fissures, invasions, and bounties.
- **Bounty Information**: Displays current bounties for factions like Zariman, Cavia, and Hex.
- **Fissure Updates**: Tracks both Steel Path and normal Void Fissures.
- **Invasion Alerts**: Fetches and displays active invasions with rewards.

## Commands

- `/setinvasionchannel`: Sets the channel for invasion updates.

### Utility Commands

- `/fissures`: Displays current non-Steel Path fissures.
- `/spfissures`: Displays current Steel Path fissures.
- `/allfissures`: Displays all fissures, including Steel Path and non-Steel Path.
- `/zariman`: Provides Zariman bounty details.
- `/cavia`: Displays Cavia bounty information.
- `/hex`: Provides Hex bounty details.

## How to run/test

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/warframeBot.git
   ```

2. Edit the `config.json` file with your Discord bot token and other settings:

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

### Planned Features

- **Archon Hunt**
  - _Coordination_: Social feature to help players team up for Archon Hunts.
- **Void Storm Tracking**: Integration with ActiveMissions for Void Storms.
- **Circuit Tracking**: Displays progress for both Steel Path and Normal Circuits.
- **Alerts**: Notifications for Gift of the Lotus alerts and other time-sensitive events.
- **Environments** (Earth: Night/Day, PoE: Night/Day, etc)
- **Void Storms** (might be with ActiveMissions)
- Baro Ki'Teer (next visit and items)
- EDA and ETA
- Teshin

### TODO

- UNINSTALL WRANGLER / CLOUDFLARE STUFF

## Packages required

- discord.js
