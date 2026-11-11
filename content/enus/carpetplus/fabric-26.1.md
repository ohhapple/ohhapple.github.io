---
title: CarpetPlus fabric-26.1 Documentation
description: Minecraft Carpet extension mod, providing more game feature control and optimization.
collection: carpetplus
cardOrder: 2
cardDescription: Release Date: 2026-03-25<br>Support for Minecraft 26.1
---
### 📦 Quick Start

- Download the latest version from [GitHub Releases](https://github.com/ohhapple/CarpetPlus/releases)
- If you encounter problems, submit [GitHub Issues](https://github.com/ohhapple/CarpetPlus/issues)
- Place the jar in Minecraft's `mods` folder (requires Fabric Loader)
- Use `/carpet` to open the menu and enable or disable rules

### ✨ Key Features

- Supports Minecraft 26.1

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
## StackableMilkBucket
id: rule-StackableMilkBucket
tags: ohhapple | FEATURE
description: Milk buckets can be stacked.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableMilkBucket 64`
## EquipmentUnbreak
id: rule-EquipmentUnbreak
tags: ohhapple | FEATURE
description: Equipment does not consume durability.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet EquipmentUnbreak true`
## ShulkerBoxNested
id: rule-ShulkerBoxNested
tags: ohhapple | FEATURE
description: Shulker boxes can be nested, with optional operator control: player only, hopper/dropper only, or all.
meta: Type: `String` | Default: `"false"` | Options: `"false"`, `"player"`, `"hopper"`, `"all"`
enable: Enable command: `/carpet ShulkerBoxNested all`
## CarpetPlusNetwork
id: rule-CarpetPlusNetwork
tags: ohhapple | FEATURE
description: Master switch for CarpetPlus network features (music sync and player data exchange). Enabled by default.
meta: Type: `boolean` | Default: `true` | Options: `true, false`
enable: Enable command: `/carpet CarpetPlusNetwork true`
## GetPlayerFps
id: rule-GetPlayerFps
tags: ohhapple | FEATURE
description: Retrieve real-time FPS of server players.
meta: Type: `String` | Default: `"false"` | Options: `"false"`, `"true"`
enable: Enable command: `/carpet GetPlayerFps true`
## AmethystShardMusicChannel
id: rule-AmethystShardMusicChannel
tags: ohhapple | FEATURE
description: When enabled, right-clicking an amethyst shard opens the music GUI.
meta: Type: `boolean` | Default: `false` | Options: `true`, `false`
enable: Enable command: `/carpet AmethystShardMusicChannel true`
:::

### 🎵 Music Channel

Want to listen to music while playing? This mod includes a music channel ↓↓↓

Note: Some songs may not be playable because they are paid online tracks or have copyright restrictions. Loading takes about 3-5 seconds depending on network speed.

Note: Multi-player listening on a server requires the CarpetPlus network master switch to be enabled (enabled by default): `/carpet CarpetPlusNetwork true`.

- Type `++cp music` in chat to open the music menu GUI
- `/carpet CarpetPlusNetwork [boolean default=true]`
- `/carpet AmethystShardMusicChannel [boolean default=false]` Amethyst shard music channel
