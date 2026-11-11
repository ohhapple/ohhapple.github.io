---
title: Monster Conquest Documentation
description: A Minecraft 1.21.1 / NeoForge faction warfare mod with recruitment, army command, RTS combat, guns, tactical equipment, and auto battler gameplay.
layout: article
badge: Monster Conquest
icon: fas fa-flag
back: docs
backLabel: Back to Docs Index
heroWidth: 800px
pageType: project
featured: true
cardTitle: Monster Conquest
cardDescription: A Minecraft 1.21.1 / NeoForge faction warfare and RTS command mod.
cardIcon: fas fa-flag
cardOrder: 4
---

### 📋 Requirements

- Minecraft 1.21.1
- NeoForge 21.1.251 or newer within the 21.x series
- Required on both the client and the server

### ⚔️ Gameplay Overview

- **Faction warfare**: Undead, Villager, Illager, Nether, End, Monster, Neutral, and a separate faction for each player. Factions can be allied or hostile, with relations configurable or editable through the in-game interface.
- **Recruitment and upkeep**: Right-click a Recruitment Station to recruit or upgrade soldiers by tier. Prices are configured per unit. Trade Stations sell ammunition, guns, and tactical equipment. Both stations can read the player's inventory.
- **Army command**: Use the Control Tool to select and command units, issue follow, move, and attack orders, open the R command wheel, or enter RTS mode with V.
- **Unit roles**: Melee, archer, gunner, thrower, mage, dual-form, and flying units.
- **Guns and equipment**: Rifles, shotguns, sniper rifles, rocket launchers, and their ammunition, plus bulletproof vests, warm clothes, ammo boxes, and backpacks.
- **War horse dyeing**: Hold a dye and sneak-right-click a war horse or cavalry mount to change its color. Cavalry retain the color across dismounting and mounting again.
- **Unit AI**: Formation arrangement, marching, maze routing, door opening, ladder climbing, and water traversal.
- **Auto Battler**: Press X to open the Monster Conquest auto battler lobby. The complete guide is available in the project repository.
- **Guide book**: Craft the guide book to read chapter-based instructions for command, recruitment, trading, and other systems.

### ⌨️ Default Keybindings

All keybindings can be changed in the vanilla Options → Controls screen.

- `N`: Open Faction Relations
- `R`: Hold to open the Command Wheel
- `V`: Toggle RTS mode
- `1` to `5`: RTS Line, Shield Wall, Wedge, Skirmish, and Free Roam formations
- `Z` / `C`: Mount / dismount in RTS mode
- `X`: Open the Auto Battler lobby
- `H`: Open Tactical Equipment slots
- `B`: Open a backpack placed in the Tactical Equipment slots

### 📟 Commands

- `/monsterc faction GUI`: Open the faction relations interface
- `/monsterc spawnpoints on/off`: Globally enable or disable all monster spawn points
- `/monsterc arena shutdown`: OP-only force shutdown of the Auto Battler child server
- `/monsterc arena history clear <player>`: OP-only clearing of a player's Auto Battler history

### ⚙️ Configuration

On first launch, modular configuration files are generated under `config/monster_conquest/`. Recruitment prices, faction relations, unit stats, AI, and other rules can be changed in the corresponding TOML files.

Auto Battler settings are stored in `arena-common.toml`; `[childServer].enabled` controls whether the arena child server starts. To expose only one TCP port, enable the embedded gateway:

```toml
[network]
embeddedGatewayRouting = true
publicHost = "public-ip-or-domain"

[network.gateway]
gatewayPort = 26565
gatewayMaxConnections = 256

[network.arena]
arenaServerPort = 24565
maxPlayers = 128
```

With the gateway enabled, players connect to `public-ip-or-domain:26565`, and only the gateway port must be allowed through the firewall. `publicHost` must be an address or domain reachable by players.

Set `updateCheckEnabled` to `false` in `general-common.toml` to disable update checks.

### 🛠️ Build

JDK 21 is required:

```powershell
.\gradlew.bat build
```

Build output is written to `build/libs/`.

### 🔗 Downloads and Project

- [GitHub Releases](https://github.com/ohhapple/Monster-Conquest/releases)
- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/monster-conquest)
- [Modrinth](https://modrinth.com/mod/monster-conquest)
- [GitHub repository](https://github.com/ohhapple/Monster-Conquest)

The mod may be played, recorded, streamed, redistributed for free, and modified without charge. Commercial use is prohibited. Modified and redistributed versions must retain the original author and source attribution.
