---
title: CarpetPlus fabric-26.3 Documentation
description: CarpetPlus documentation for Minecraft 26.3, including rules and the music player.
collection: carpetplus
cardOrder: 3
cardDescription: Supports Minecraft 26.3
---

### 📦 Quick Start

- Download the latest version from [GitHub Releases](https://github.com/ohhapple/CarpetPlus/releases)
- If you encounter problems, submit [GitHub Issues](https://github.com/ohhapple/CarpetPlus/issues)
- Place it in Minecraft's `mods` folder (requires Fabric Loader)
- Use `/carpet` to open the menu and enable or disable rules

### ✨ Key Features

- Minecraft 26.3 support
- A complete in-game music player with search, recommendations, lyrics, queues, favorites, and channels
- Screen-space lyrics, world-space 3D lyrics, and a compact HUD player
- Multiplayer listening through music channels when CarpetPlus networking is enabled

::: rules
title: 📜 Rule List
toc: 📑 Table of Contents
search: Search rules
## SuperWindCharge
id: rule-SuperWindCharge
tags: ohhapple | FEATURE
description: Increases the damage, range, and knockback of wind charges thrown by players.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet SuperWindCharge true`
## VillageAlwaysBreed
id: rule-VillageAlwaysBreed
tags: ohhapple | FEATURE
description: Villagers, including baby villagers, continue breeding when there are more than two villagers and spare beds are available.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet VillageAlwaysBreed true`
## SuperSponge
id: rule-SuperSponge
tags: ohhapple | FEATURE
description: Select which fluids the sponge can absorb. Use SuperSpongeRadius to adjust the effective range.
meta: Type: `String` | Default: `"false"` | Options: `"false"`, `"water"`, `"lava"`, `"both"`
enable: Enable command: `/carpet SuperSponge both`
## SuperSpongeRadius
id: rule-SuperSpongeRadius
tags: ohhapple | FEATURE
description: Sets the effective radius for SuperSponge mode. SuperSponge must be enabled first.
meta: Type: `int` | Default: `6` | Options: `0, 6, 10, 20, 100`
enable: Enable command: `/carpet SuperSpongeRadius 100`
## concreteBurnedIntoglass
id: rule-concreteBurnedIntoglass
tags: ohhapple | FEATURE
description: Allows all 16 concrete powder colors to be smelted into matching stained glass.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet concreteBurnedIntoglass true`
## StackablePotion
id: rule-StackablePotion
tags: ohhapple | FEATURE
description: Sets the maximum stack size for potions.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackablePotion 64`
## StackableEnchantedBook
id: rule-StackableEnchantedBook
tags: ohhapple | FEATURE
description: Sets the maximum stack size for enchanted books.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableEnchantedBook 64`
## StackableTotemOfUndying
id: rule-StackableTotemOfUndying
tags: ohhapple | FEATURE
description: Sets the maximum stack size for Totems of Undying.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableTotemOfUndying 64`
## StackableMilkBucket
id: rule-StackableMilkBucket
tags: ohhapple | FEATURE
description: Sets the maximum stack size for milk buckets.
meta: Type: `int` | Default: `1` | Options: `1, 16, 64`
enable: Enable command: `/carpet StackableMilkBucket 64`
## EquipmentUnbreak
id: rule-EquipmentUnbreak
tags: ohhapple | FEATURE
description: Equipment no longer consumes durability.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet EquipmentUnbreak true`
## ShulkerBoxNested
id: rule-ShulkerBoxNested
tags: ohhapple | FEATURE
description: Controls whether shulker boxes can be placed inside other shulker boxes by players, redstone containers, or both.
meta: Type: `String` | Default: `"false"` | Options: `"false"`, `"player"`, `"redstone"`, `"both"`
enable: Enable command: `/carpet ShulkerBoxNested both`
## CarpetPlusNetwork
id: rule-CarpetPlusNetwork
tags: ohhapple | PLUS_NETWORK
description: Master switch for CarpetPlus networking. Multiplayer music channels and network synchronization require it to be enabled.
meta: Type: `boolean` | Default: `true` | Options: `true, false`
enable: Enable command: `/carpet CarpetPlusNetwork true`
## GetPlayerFps
id: rule-GetPlayerFps
tags: ohhapple | PLUS_NETWORK | COMMAND
description: Retrieves and displays the real-time FPS of server players.
meta: Type: `String` | Default: `"false"` | Options: `0`, `1`, `2`, `3`, `4`, `ops`, `true`, `false`
enable: Enable command: `/carpet GetPlayerFps true`
## AmethystShardMusicChannel
id: rule-AmethystShardMusicChannel
tags: ohhapple | CLIENT
description: Allows `++cp music` in chat or right-clicking an amethyst shard to open the music player.
meta: Type: `boolean` | Default: `false` | Options: `true, false`
enable: Enable command: `/carpet AmethystShardMusicChannel true`
:::

### 🎵 Music Player

- Search, recommendations, cover art, artist and album information, duration, lyrics and translations, volume, seeking, and a playback queue
- Search results categorized by songs, playlists, artists, and albums
- Discovery includes daily recommendations, private roaming, radar playlists, daily mixes, charts, scene radio, and categorized playlists
- Audio uses temporary stream URLs and bounded prefetching; songs are not saved locally
- Screen lyrics, world-space 3D lyrics, and a compact top HUD player
- Music channels for shared listening; tracks are shared only within the same channel
- Optional platform login with account playlist and favorite-song synchronization

Enable both rules for multiplayer listening:

```text
/carpet CarpetPlusNetwork true
/carpet AmethystShardMusicChannel true
```

### 🔐 Account and Cookie Security

- Music platform login is completely optional. Public search, recommendations, and playable content remain available while logged out.
- Cookies, `MUSIC_U`, QR login keys, account information, and encrypted login files must remain local to the client. Never send them to other players, upload them to a server, or include them in an issue.
- Do not publicly share screenshots or logs containing cookies, QR keys, account names, or server addresses. Remove private information before sharing a troubleshooting log.
- Favorites, playlists, and account credentials are encrypted locally with a random installation key using AES-GCM, but encryption does not replace securely storing the files. Do not insert a `data-key` or encrypted data received from someone else into your client.

### ⚠️ Disclaimer

CarpetPlus is an unofficial project. It is not affiliated with, authorized by, or partnered with Mojang Studios, Microsoft, music platforms, or their affiliates. Related names are used only to describe compatibility and service sources.

CarpetPlus does not bypass music platform login, membership, payment, copyright, or regional restrictions. Playback depends on platform APIs, copyright status, and the current account's entitlements. The project does not guarantee that any song, playlist, lyric, or API will remain available.

By using this mod, you understand and accept the related risks. Back up worlds and configuration before use, and follow the rules of your server and the terms of service of the music platform. The project is provided as-is under its license and makes no additional guarantees regarding data loss, account risk, service interruption, or API changes.

For more information, see the [CarpetPlus GitHub repository](https://github.com/ohhapple/CarpetPlus).
