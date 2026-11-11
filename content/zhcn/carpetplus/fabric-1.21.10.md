---
title: CarpetPlus fabric-1.21.10 文档
description: Minecraft Carpet 扩展模组，提供更多游戏特性控制与优化。
collection: carpetplus
cardOrder: 1
cardDescription: 发布日期：2026-01-19<br>首个公开发布版本
---
### 📦 快速开始

- 从 [GitHub Releases](https://github.com/ohhapple/CarpetPlus/releases) 下载最新版本
- 如遇到问题，请在 GitHub 提交 [Issues](https://github.com/ohhapple/CarpetPlus/issues)
- 放入 Minecraft 的 `mods` 文件夹（需要 Fabric 加载器）
- 输入指令 `/carpet` 打开菜单，启用或禁用规则

### ✨ 主要特性

- 首个公开发布的版本

详情请访问 [GitHub 仓库](https://github.com/ohhapple/CarpetPlus)。

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
description: 只要村民（小村民也会繁殖）数量大于二并且周围有多余的空床，就会开始繁殖行为。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet VillageAlwaysBreed true`
## 超级海绵模式 (SuperSponge)
id: rule-SuperSponge
toc: 超级海绵模式<br>(SuperSponge)
tags: ohhapple | FEATURE
description: 选择海绵可以吸收什么流体，开启后还可以自定义吸收范围。
meta: 类型: `String` | 默认值: `"false"` | 可选参数: `"false"`, `"water"`, `"lava"`, `"both"`
enable: 开启方法: `/carpet SuperSponge both`
## 超级海绵生效半径 (SuperSpongeRadius)
id: rule-SuperSpongeRadius
toc: 超级海绵生效半径<br>(SuperSpongeRadius)
tags: ohhapple | FEATURE
description: 设置超级海绵模式下的生效半径，需要使用 `/carpet SuperSponge` 开启超级海绵模式。
meta: 类型: `int` | 默认值: `6` | 可选参数: `0, 6, 10, 20, 100`
enable: 开启方法: `/carpet SuperSpongeRadius 100`
## 启用玩家独立视距 (playerSpecificChunks)
id: rule-playerSpecificChunks
toc: 启用玩家独立视距<br>(playerSpecificChunks)
tags: ohhapple | FEATURE | !该规则在后续版本弃用
description: 可以单独控制服务器玩家的视距。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet playerSpecificChunks true`
## 16色混凝土粉末烧成16色玻璃 (concreteBurnedIntoglass)
id: rule-concreteBurnedIntoglass
toc: 16色混凝土粉末烧成16色玻璃<br>(concreteBurnedIntoglass)
tags: ohhapple | FEATURE
description: 16 色混凝土粉末可以在熔炉内烧成 16 色玻璃。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet concreteBurnedIntoglass true`
## 药水可堆叠 (StackablePotion)
id: rule-StackablePotion
toc: 药水可堆叠<br>(StackablePotion)
tags: ohhapple | FEATURE
description: 药水可以堆叠。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackablePotion 64`
## 附魔书可堆叠 (StackableEnchantedBook)
id: rule-StackableEnchantedBook
toc: 附魔书可堆叠<br>(StackableEnchantedBook)
tags: ohhapple | FEATURE
description: 附魔书可以堆叠。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackableEnchantedBook 64`
## 不死图腾可堆叠 (StackableTotemOfUndying)
id: rule-StackableTotemOfUndying
toc: 不死图腾可堆叠<br>(StackableTotemOfUndying)
tags: ohhapple | FEATURE
description: 不死图腾可以堆叠。
meta: 类型: `int` | 默认值: `1` | 可选参数: `1, 16, 64`
enable: 开启方法: `/carpet StackableTotemOfUndying 64`
## 装备不消耗耐久 (EquipmentUnbreak)
id: rule-EquipmentUnbreak
toc: 装备不消耗耐久<br>(EquipmentUnbreak)
tags: ohhapple | FEATURE
description: 装备不消耗耐久。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet EquipmentUnbreak true`
## 潜影盒嵌套 (ShulkerBoxNested)
id: rule-ShulkerBoxNested
toc: 潜影盒嵌套<br>(ShulkerBoxNested)
tags: ohhapple | FEATURE
description: 潜影盒可以嵌套，包括玩家手动放入和漏斗等放入。
meta: 类型: `boolean` | 默认值: `false` | 可选参数: `true, false`
enable: 开启方法: `/carpet ShulkerBoxNested true`
:::

### 📟 指令 [command]

关于玩家独立视距范围的指令：

- 启用功能：`/carpet playerSpecificChunks true`
- 开启功能后玩家默认视距被设置为 10（不会超过服务器视距）
- 设置玩家视距：`/playerchunk set`
- 查看玩家视距：`/playerchunk get`
- 列出所有设置：`/playerchunk list`
- 查看状态：`/playerchunk status`
- 统计信息：`/chunkstats`

### 📝 示例代码

```text
启用功能
/carpet playerSpecificChunks true
开启功能后玩家默认视距被设置为10（不会超过服务器视距）

设置单个玩家
/playerchunk set 玩家A 10

设置多个玩家
/playerchunk set @a 10          # 所有玩家
/playerchunk set @r 8           # 随机玩家
/playerchunk set @p 12          # 最近的玩家

查看设置
/playerchunk get 玩家A
/playerchunk get @s             # 自己

列出所有设置
/playerchunk list

查看状态
/playerchunk status

统计信息
/chunkstats
```
