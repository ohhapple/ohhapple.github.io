---
title: CarpetPlus fabric-26.3 文档
description: Minecraft 26.3 的 CarpetPlus 扩展文档，包含规则说明与音乐播放器功能。
collection: carpetplus
cardOrder: 3
cardDescription: 支持 Minecraft 26.3
---

### 📦 快速开始

- 从 [GitHub Releases](https://github.com/ohhapple/CarpetPlus/releases) 下载最新版本
- 如遇到问题，请在 GitHub 提交 [Issues](https://github.com/ohhapple/CarpetPlus/issues)
- 放入 Minecraft 的 `mods` 文件夹（需要 Fabric 加载器）
- 输入指令 `/carpet` 打开菜单，启用或禁用规则

### ✨ 主要特性

- 支持 Minecraft 26.3
- 内置完整音乐播放器、搜索、推荐、歌词、队列、收藏和音乐频道
- 支持屏幕悬浮歌词、世界空间 3D 歌词和顶部迷你播放器
- 音乐频道支持多人一起听，需要开启 CarpetPlus 网络协议规则

::: rules
title: 📜 规则列表
toc: 📑 目录
search: 搜索规则
## 风弹螺旋丸手里剑 (SuperWindCharge)
id: rule-SuperWindCharge
toc: 风弹螺旋丸手里剑<br>(SuperWindCharge)
tags: ohhapple | FEATURE
description: 使玩家投出的风弹伤害、范围、击退属性增大。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet SuperWindCharge true`
## 村民一直繁殖 (VillageAlwaysBreed)
id: rule-VillageAlwaysBreed
toc: 村民一直繁殖<br>(VillageAlwaysBreed)
tags: ohhapple | FEATURE
description: 村民（包括小村民）数量大于二且周围有多余空床时，会持续进行繁殖。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet VillageAlwaysBreed true`
## 超级海绵模式 (SuperSponge)
id: rule-SuperSponge
toc: 超级海绵模式<br>(SuperSponge)
tags: ohhapple | FEATURE
description: 设置海绵可以吸收的流体类型，可配合 SuperSpongeRadius 调整生效范围。
meta: 类型: `String` | 默认值: `"false"` | 可选参数: `"false"`, `"water"`, `"lava"`, `"both"`
enable: 开启方法: `/carpet SuperSponge both`
## 超级海绵生效半径 (SuperSpongeRadius)
id: rule-SuperSpongeRadius
toc: 超级海绵生效半径<br>(SuperSpongeRadius)
tags: ohhapple | FEATURE
description: 设置超级海绵模式下的生效半径，需要先开启 SuperSponge。
meta: 类型: `int` | 默认值: `6` | 可选参数: `0, 6, 10, 20, 100`
enable: 开启方法: `/carpet SuperSpongeRadius 100`
## 混凝土粉末烧玻璃 (concreteBurnedIntoglass)
id: rule-concreteBurnedIntoglass
toc: 混凝土粉末烧玻璃<br>(concreteBurnedIntoglass)
tags: ohhapple | FEATURE
description: 16 色混凝土粉末可以在熔炉内烧成对应颜色的玻璃。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet concreteBurnedIntoglass true`
## 药水可堆叠 (StackablePotion)
id: rule-StackablePotion
toc: 药水可堆叠<br>(StackablePotion)
tags: ohhapple | FEATURE
description: 设置药水的最大堆叠数量。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackablePotion 64`
## 附魔书可堆叠 (StackableEnchantedBook)
id: rule-StackableEnchantedBook
toc: 附魔书可堆叠<br>(StackableEnchantedBook)
tags: ohhapple | FEATURE
description: 设置附魔书的最大堆叠数量。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackableEnchantedBook 64`
## 不死图腾可堆叠 (StackableTotemOfUndying)
id: rule-StackableTotemOfUndying
toc: 不死图腾可堆叠<br>(StackableTotemOfUndying)
tags: ohhapple | FEATURE
description: 设置不死图腾的最大堆叠数量。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackableTotemOfUndying 64`
## 奶桶可堆叠 (StackableMilkBucket)
id: rule-StackableMilkBucket
toc: 奶桶可堆叠<br>(StackableMilkBucket)
tags: ohhapple | FEATURE
description: 设置奶桶的最大堆叠数量。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackableMilkBucket 64`
## 装备不消耗耐久 (EquipmentUnbreak)
id: rule-EquipmentUnbreak
toc: 装备不消耗耐久<br>(EquipmentUnbreak)
tags: ohhapple | FEATURE
description: 装备使用时不消耗耐久度。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet EquipmentUnbreak true`
## 潜影盒嵌套 (ShulkerBoxNested)
id: rule-ShulkerBoxNested
toc: 潜影盒嵌套<br>(ShulkerBoxNested)
tags: ohhapple | FEATURE
description: 控制潜影盒是否可由玩家、红石容器或两者放入其他潜影盒。
meta: 类型: `String` | 默认值: `"false"` | 可选参数: `"false"`, `"player"`, `"redstone"`, `"both"`
enable: 开启方法: `/carpet ShulkerBoxNested both`
## CarpetPlus网络协议总开关 (CarpetPlusNetwork)
id: rule-CarpetPlusNetwork
toc: CarpetPlus网络协议总开关<br>(CarpetPlusNetwork)
tags: ohhapple | PLUS_NETWORK
description: CarpetPlus 网络协议处理总开关，开启后才能使用网络同步和多人音乐频道功能。
meta: 类型: `boolean` | 默认值: `true` | 可选参数: `true, false`
enable: 开启方法: `/carpet CarpetPlusNetwork true`
## 获取服务器玩家FPS (GetPlayerFps)
id: rule-GetPlayerFps
toc: 获取服务器玩家FPS<br>(GetPlayerFps)
tags: ohhapple | PLUS_NETWORK | COMMAND
description: 获取并显示服务器玩家的实时 FPS。
meta: 类型: `String` | 默认值: `"false"` | 可选参数: `0`, `1`, `2`, `3`, `4`, `ops`, `true`, `false`
enable: 开启方法: `/carpet GetPlayerFps true`
## 紫水晶碎片音乐频道 (AmethystShardMusicChannel)
id: rule-AmethystShardMusicChannel
toc: 紫水晶碎片音乐频道<br>(AmethystShardMusicChannel)
tags: ohhapple | CLIENT
description: 开启后可在聊天框输入 `++cp music`，或手持紫水晶碎片右键打开音乐播放器。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet AmethystShardMusicChannel true`
:::

### 🎵 音乐播放器

- 支持歌曲搜索、推荐、封面、歌手/专辑、时长、歌词与翻译、音量、进度拖动和播放队列
- 搜索结果可按歌曲、歌单、歌手和专辑分类浏览
- 发现页包含每日推荐、私人漫游、雷达歌单、每日 Mix、排行榜、场景电台和分类推荐
- 音频使用临时音源直链和有限预读，不保存歌曲到本地
- 支持屏幕悬浮歌词、世界空间 3D 歌词和顶部迷你播放器
- 支持多人音乐频道；分享歌曲只会发给同一频道成员
- 平台登录可选，登录后可同步账号歌单和“我喜欢的音乐”

多人一起听需要同时开启：

```text
/carpet CarpetPlusNetwork true
/carpet AmethystShardMusicChannel true
```

### 🔐 账号与 Cookie 安全

- 音乐平台登录完全可选；未登录仍可使用公开搜索、推荐和可播放内容。
- Cookie、`MUSIC_U`、二维码登录 key、账号资料和加密登录文件都只应保留在客户端本机，禁止发送给其他玩家、上传到服务器或提交到 Issue。
- 不要公开分享包含 Cookie、二维码 key、账号昵称或服务器地址的截图和日志。发送排障日志前请先删除相关隐私信息。
- 收藏、歌单和账号凭据使用本机随机密钥通过 AES-GCM 加密保存，但加密不能替代妥善保管文件。不要将从他人处获得的 `data-key` 和加密数据直接放入自己的客户端。

### ⚠️ 免责声明

CarpetPlus 是非官方项目，与 Mojang Studios、Microsoft、音乐平台及其关联方不存在隶属、授权或合作关系，相关名称仅用于说明兼容范围和服务来源。

CarpetPlus 不绕过音乐平台的登录、会员、付费、版权或地区限制。歌曲能否播放取决于平台接口、版权状态和当前账号权益，项目不保证任何歌曲、歌单、歌词或接口持续可用。

使用本模组即表示你理解并自行承担相关风险。建议在使用前备份世界与配置，并遵守所在服务器的规则及音乐平台的服务条款。项目按许可证现状提供，不对数据丢失、账号风险、服务中断或接口变化作额外担保。

更多信息请查看 [CarpetPlus GitHub 仓库](https://github.com/ohhapple/CarpetPlus)。
