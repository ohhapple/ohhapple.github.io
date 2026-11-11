---
title: MCModifier 文档
description: 这是一个基于 Java 开发的 Minecraft 注入器，用于在 Minecraft 进程外动态修改 Carpet 及其附属 Mod 的规则，并且可以执行自定义命令，同时可监控 Minecraft 控制台。
layout: article
badge: MCModifier
icon: fas fa-cube
back: docs
backLabel: 返回文档索引
heroWidth: 800px
pageType: project
featured: true
cardTitle: MCModifier
cardDescription: Minecraft 注入器，在进程外动态修改 Carpet 及其附属 Mod 的规则，并可执行自定义命令、监控控制台。
cardIcon: fas fa-window-maximize
cardOrder: 3
cardTag: 文档
cardAction: 阅读
---
### ✨ 主要特性

- 动态修改 Carpet 规则（无需重启游戏）
- 执行自定义命令
- 实时监控 Minecraft 控制台输出

### 📋 运行要求

- Java 版本：≥ 11（JDK 11 及以上版本）
- 操作系统：本程序使用 Windows 系统开发，其他系统未测试
- Minecraft 版本：≥ 26.1（对应 Carpet Mod 版本需兼容）

### 🚀 使用方法

- 确保你的电脑已安装 **Java 11 或更高版本**（终端或命令行输入 `java -version` 检查）
- 下载本项目的压缩包并解压到任意目录
- 直接双击文件 `MCModifier**.jar` 或运行 `Run.bat` 即可启动程序

### ⚠️ 注意事项（必看！！！）

- 双击无反应：1. 检查 Java 版本是否符合要求（需 ≥ 11）；2. 若系统未识别 Java，可手动配置环境变量，或通过命令行运行；3. 不要移动文件结构，保持所有文件在同一目录。
- 放在中文路径下会导致无法注入；若 Minecraft 进程名称包含中文，可能出现乱码，此为已知限制。
- 如遇到 BUG 或有功能建议，请提交 [Issue](https://github.com/ohhapple/MCModifier/issues)。
- 不要给他人发送日志信息。若 Minecraft 为正版登录，进程名中会包含玩家 UUID 和鉴权密钥等信息，请注意保护隐私，后果自负。

版权所有 © 2026 ohhapple。保留所有权利。

更多详情请查看 [GitHub 仓库](https://github.com/ohhapple/MCModifier) 或加入社区讨论。
