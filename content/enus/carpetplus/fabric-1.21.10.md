---
title: CarpetPlus fabric-1.21.10 Documentation
description: Minecraft Carpet extension mod, providing more game feature control and optimization.
collection: carpetplus
cardOrder: 1
cardDescription: Release Date: 2026-01-19<br>First publicly released version
---
### 📦 Quick Start

- Download the latest version from [GitHub Releases](https://github.com/ohhapple/CarpetPlus/releases)
- If you encounter problems, submit [GitHub Issues](https://github.com/ohhapple/CarpetPlus/issues)
- Place the jar in Minecraft's `mods` folder (requires Fabric Loader)
- Use `/carpet` to open the menu and enable or disable rules

### ✨ Key Features

- First public release

For more details, visit the [GitHub repository](https://github.com/ohhapple/CarpetPlus).

::: rules
title: 📜 Rule List
toc: 📑 Table of Contents
search: Search rules
## SuperWindCharge
id: rule-SuperWindCharge
tags: ohhapple | FEATURE
description: Increases damage, range, and knockback of wind charges thrown by players.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet SuperWindCharge true`
## VillageAlwaysBreed
id: rule-VillageAlwaysBreed
tags: ohhapple | FEATURE
description: Villagers (including baby villagers) will start breeding if there are more than two and extra beds are available.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet VillageAlwaysBreed true`
## SuperSponge
id: rule-SuperSponge
tags: ohhapple | FEATURE
description: Choose which fluids the sponge can absorb; after enabling, you can also customize the absorption range.
meta: Type: `String` | Default: `"false"` | Options: `"false"`, `"water"`, `"lava"`, `"both"`
enable: Enable command: `/carpet SuperSponge both`
## SuperSpongeRadius
id: rule-SuperSpongeRadius
tags: ohhapple | FEATURE
description: Set the effective radius for SuperSponge mode. Requires `/carpet SuperSponge` to be enabled.
meta: Type: `int` | Default: `6` | Options: `0, 6, 10, 20, 100`
enable: Enable command: `/carpet SuperSpongeRadius 100`
## playerSpecificChunks
id: rule-playerSpecificChunks
tags: ohhapple | FEATURE | !This rule is deprecated in later versions
description: Allows per-player view distance control on the server.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet playerSpecificChunks true`
## concreteBurnedIntoglass
id: rule-concreteBurnedIntoglass
tags: ohhapple | FEATURE
description: 16-color concrete powder can be smelted into 16-color glass in a furnace.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet concreteBurnedIntoglass true`
## StackablePotion
id: rule-StackablePotion
tags: ohhapple | FEATURE
description: Potions can be stacked.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackablePotion 64`
## StackableEnchantedBook
id: rule-StackableEnchantedBook
tags: ohhapple | FEATURE
description: Enchanted books can be stacked.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableEnchantedBook 64`
## StackableTotemOfUndying
id: rule-StackableTotemOfUndying
tags: ohhapple | FEATURE
description: Totems of Undying can be stacked.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableTotemOfUndying 64`
## EquipmentUnbreak
id: rule-EquipmentUnbreak
tags: ohhapple | FEATURE
description: Equipment does not consume durability.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet EquipmentUnbreak true`
## ShulkerBoxNested
id: rule-ShulkerBoxNested
tags: ohhapple | FEATURE
description: Shulker boxes can be nested, including manual insertion and insertion by hoppers.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet ShulkerBoxNested true`
:::

### 📟 Commands

Commands for player-specific view distance:

- Enable feature: `/carpet playerSpecificChunks true`
- After enabling, the default player view distance is set to 10 and cannot exceed the server view distance
- Set view distance: `/playerchunk set`
- Get view distance: `/playerchunk get`
- List all settings: `/playerchunk list`
- Check status: `/playerchunk status`
- Statistics: `/chunkstats`

### 📝 Example Code

```text
Enable feature
/carpet playerSpecificChunks true
The default player view distance is now 10 and cannot exceed the server view distance.

Set a player's view distance
/playerchunk set PlayerA 10

Set multiple players
/playerchunk set @a 10          # All players
/playerchunk set @r 8           # Random player
/playerchunk set @p 12          # Nearest player

Get settings
/playerchunk get PlayerA
/playerchunk get @s             # Yourself

List all settings
/playerchunk list

Check status
/playerchunk status

Statistics
/chunkstats
```
