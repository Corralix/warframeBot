# Warframe Bot

A Discord bot designed to provide Warframe players with real-time information about missions, bounties, fissures, and other in-game events.


### Main Commands

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
   - `/target` is an optional argument to look for specific circuit reward.
- `/worldcyle`: Provides the current day cycles of all open worlds (PoE, Orb Vallis, Cambion Drift, and Earth).
- `/arbitrations`: Provides the current and next arbitration missions.

### Utility Commands

- `/help`: Provides all current usable commands for the bot.
- `/setinvasionchannel`: Sets the channel for invasion updates.

## Planned Features

- **Alerts**: Notifications for Gift of the Lotus alerts and other time-sensitive events.
- **Void Storms** (is in VoidStorms WorldState JSON)
- Baro Ki'Teer (next visit and items)
- Teshin (Weekly item)

- Add a clock to `worldcycle` command to alert (@customrole) users of rarer times (eg. night on Cetus)
- Add an alert (@customrole) to invasions so users know when there are good invasions (eg. orokin potatoes)