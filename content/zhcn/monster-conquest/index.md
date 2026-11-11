---
title: Monster Conquest 文档
description: Minecraft 1.21.1 / NeoForge 的阵营战争模组，包含招募、军队指挥、RTS 战斗、枪械、战术装备和自走棋玩法。
layout: article
badge: Monster Conquest
icon: fas fa-flag
back: docs
backLabel: 返回文档索引
heroWidth: 800px
pageType: project
featured: true
cardTitle: Monster Conquest
cardDescription: Minecraft 1.21.1 / NeoForge 阵营战争与 RTS 指挥模组。
cardIcon: fas fa-flag
cardOrder: 4
---

### 📋 环境要求

- Minecraft 1.21.1
- NeoForge 21.1.251 或更高（21.x 系列）
- 客户端与服务端都需要安装

### ⚔️ 玩法概览

- **阵营战争**：包含亡灵、村民、灾厄、下界、末地、怪物、中立以及每位玩家独立的玩家阵营。阵营可以结盟或敌对，关系可在配置或游戏内界面调整。
- **招募与军费**：右键募兵站打开界面，按等级招募或升级士兵，价格按兵种单独配置；交易站出售弹药、枪械和战术装备，两者都能直接读取玩家背包。
- **军队指挥**：使用控制工具选中和命令单位，支持跟随、前往、攻击、R 键指挥轮盘和 V 键 RTS 模式。
- **兵种系统**：包含近战、弓手、枪手、投掷、魔法师、双形态和飞行单位。
- **枪械与装备**：支持步枪、霰弹枪、狙击枪、火箭筒及其弹药，并提供防弹衣、保暖衣、弹药箱和背包等战术装备。
- **战马染色**：手持染料并潜行右键战马或骑兵坐骑，可以长期改变其颜色。
- **单位 AI**：包含阵型排布、行军跟队、迷宫绕行、开门、爬梯和涉水寻路。
- **自走棋玩法**：按 X 打开 Monster Conquest 自走棋大厅，完整流程和经济规则可在项目仓库的玩法图鉴中查看。
- **教程书**：合成教程书后，可以按章节查看指挥、招募和交易等说明。

### ⌨️ 默认按键

所有按键都可以在原版“选项 → 按键控制”中修改。

- `N`：打开阵营关系界面
- `R`：按住打开指挥轮盘
- `V`：切换 RTS 模式
- `1` 到 `5`：RTS 线列、盾墙、楔形、散兵和自由站位
- `Z` / `C`：RTS 模式下上马 / 下马
- `X`：打开自走棋大厅
- `H`：打开战术装备栏
- `B`：打开放在战术装备栏中的背包

### 📟 命令

- `/monsterc faction GUI`：打开阵营关系界面
- `/monsterc spawnpoints on/off`：全局开关所有刷怪点
- `/monsterc arena shutdown`：仅 OP 可用，强制关闭自走棋竞技子服
- `/monsterc arena history clear <玩家>`：仅 OP 可用，清除指定玩家的自走棋历史战绩

### ⚙️ 配置

首次启动后会在 `config/monster_conquest/` 下生成模块化配置。招募价格、阵营关系、单位属性、AI 和其他规则可在对应 TOML 文件中修改。

自走棋配置位于 `arena-common.toml`，`[childServer].enabled` 控制是否启动竞技子服。需要只开放一个 TCP 端口时，可以启用内置网关：

```toml
[network]
embeddedGatewayRouting = true
publicHost = "公网IP或域名"

[network.gateway]
gatewayPort = 26565
gatewayMaxConnections = 256

[network.arena]
arenaServerPort = 24565
maxPlayers = 128
```

启用网关后，玩家连接 `公网IP或域名:26565`，防火墙只需放行网关端口。`publicHost` 必须填写玩家实际可以访问的公网地址或域名。

可以在 `general-common.toml` 中把 `updateCheckEnabled` 设为 `false` 来关闭更新检查。

### 🛠️ 构建

需要 JDK 21：

```powershell
.\gradlew.bat build
```

构建产物位于 `build/libs/`。

### 🔗 下载与项目

- [GitHub Releases](https://github.com/ohhapple/Monster-Conquest/releases)
- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/monster-conquest)
- [Modrinth](https://modrinth.com/mod/monster-conquest)
- [GitHub 仓库](https://github.com/ohhapple/Monster-Conquest)

本项目允许免费游玩、录制、直播、免费再分发和修改，但禁止任何形式的商业用途。修改版和再分发版必须保留作者及官方来源说明。
