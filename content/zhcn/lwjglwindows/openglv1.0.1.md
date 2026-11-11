---
title: LWJGLwindows openglv1.0.1 文档
description: 这是一个用于在 Minecraft 中创建独立窗口的 LWJGL 窗口封装库，旨在解决因 Minecraft 不同版本间原生 GUI 类（如 Screen）的差异而需频繁修改自定义 GUI 代码的问题。
collection: lwjglwindows
cardOrder: 2
cardDescription: 发布日期：2026-02-21<br>移除了对 Minecraft 客户端实例的依赖
---
### 📦 快速开始

- 项目仓库：[GitHub 仓库](https://github.com/ohhapple/LWJGLwindows)
- 如遇到问题，请提交 [GitHub Issues](https://github.com/ohhapple/LWJGLwindows/issues)
- 建议使用最新版本，可通过 tag 时间查看。一个 tag 代表一个版本，tag 名称为版本号
- 本依赖库已发布在 JitPack。在 Gradle 配置文件的 repositories 中引入 JitPack 仓库：`maven { url 'https://jitpack.io' }`
- 在 dependencies 中导入依赖：`implementation 'com.github.ohhapple:LWJGLwindows:版本号'`
- 打包进 jar 时，在 dependencies 中加入：`include 'com.github.ohhapple:LWJGLwindows:版本号'`
- 或直接加入：`include(implementation("com.github.ohhapple:LWJGLwindows:版本号"))`

### ✨ 主要特性

- 适配多版本 GUI 窗口创建而无需修改代码

### 🚀 更新说明

- 移除了对 Minecraft 客户端实例的依赖，无需传递 Minecraft 客户端实例，以应对 MC 后续版本弃用 OpenGL 的问题
- 理论上，倘若有一天 MC 彻底弃用了 OpenGL，开发者手动在 Gradle 配置文件中导入 OpenGL，本库仍可以正常使用
- 例如：`implementation "org.lwjgl:lwjgl-opengl:3.3.3"`
- Windows 运行环境：`runtimeOnly "org.lwjgl:lwjgl-opengl::natives-windows:3.3.3"`
- Linux 运行环境：`runtimeOnly "org.lwjgl:lwjgl-opengl::natives-linux:3.3.3"`
- macOS 运行环境：`runtimeOnly "org.lwjgl:lwjgl-opengl::natives-macos:3.3.3"`
- 添加了阻塞式关闭所有窗口的方法：`GuiWindows.shutdown()`

### 📝 部分构造方法

- 狭义全参构造（也可以使用其它重载的构造方法，使用默认值创建页面）
- 所谓的全参构造并不代表 UI 组件的所有参数。部分参数有默认值，可通过相关 set 方法设置
- 不推荐直接使用全参构造，推荐使用参数更少的方法重载初始化 UI 组件，然后通过相关 set 方法设置参数
- 多数情况下，参数的默认值符合大多数情况，但请自行探索

```java
// 文本框全参构造
public TextField(int x, int y, int w, int h, String p, int fontSize,//x坐标 y坐标 宽度w 高度h 默认显示提示文字 输入文字大小
                 float tr, float tg, float tb, // 输入文字颜色
                 float pr, float pg, float pb,// 占位符颜色
                 float bgR, float bgG, float bgB,// 背景颜色
                 float borderR, float borderG, float borderB,//边框颜色
                 float borderHoverR, float borderHoverG, float borderHoverB,//悬浮边框颜色
                 float borderFocusR, float borderFocusG, float borderFocusB) //焦点边框颜色

// 滑块全参数构造
public Slider(int x, int y, int width, int height, float initialValue, Consumer<Float> listener,//x坐标 y坐标 宽度 高度 初始值百分比0-1 滑动监听器输出value
              float trackR, float trackG, float trackB, //轨道颜色
              float fillR, float fillG, float fillB,//填充颜色
              float thumbR, float thumbG, float thumbB, //滑块颜色
              float thumbHoverR, float thumbHoverG, float thumbHoverB,//滑块悬浮颜色
              Integer trackHeight, Integer thumbWidth, Integer thumbHeight,//固定轨道高度像素 固定滑块宽度像素 固定滑块高度像素 (可选:传入null按组件高度百分比生成)
              boolean showValue, int valFontSize, float valR, float valG, float valB) //是否显示数值 数值字体大小 数值颜色

// 按钮全参构造
public Button(int x, int y, int w, int h, String t, Runnable a,//x坐标 y坐标 宽度 高度 点击执行事件
              int fontSize, float tr, float tg, float tb,//文字大小 文字颜色
              float bgR, float bgG, float bgB,//背景颜色
              float bgHoverR, float bgHoverG, float bgHoverB,//悬浮背景颜色
              float borderR, float borderG, float borderB,//边框颜色
              float borderHoverR, float borderHoverG, float borderHoverB)//悬浮边框颜色

// 滚动容器全参构造
public ScrollContainer(int x, int y, int w, int h, //x坐标 y坐标 宽度 高度
                       float bgR, float bgG, float bgB, //背景色
                       float borderR, float borderG, float borderB) //边框色
```

### 📝 示例（仅展示部分方法调用，其它方法自行探索）

- 该示例代码基于 CarpetPlus 项目，为 CarpetPlus 中的调试代码，仅作演示作用，并非成品
- 实际设计中建议设计成单例
- 在退出世界时建议调用 `GuiWindows.shutdown()` 阻塞式关闭所有窗口，或调用 `GuiWindows.closeAllwindows()` 非阻塞式关闭所有窗口，以确保窗口被正常关闭

```java
/*
 * This file is part of the CarpetPlus project, licensed under the
 * GNU Lesser General Public License v3.0
 *
 * Copyright (C) 2026 ohhapple and contributors
 *
 * CarpetPlus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CarpetPlus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with CarpetPlus. If not, see <https://www.gnu.org/licenses/>.
 */

package com.ohhapple.carpetplus.gui.test;

import com.ohhapple.carpetplus.gui.util.BaseGuiWindow;
import com.ohhapple.carpetplus.gui.util.GuiWindows;

public class ExamplePage {

    public static void openDemoPage() {
        // 可选设置：设置窗口图标
        BaseGuiWindow.setWindowIcon("/assets/carpetplus/icon.png");

        GuiWindows.open("演示窗口", 700, 600, win -> {
            // 可选设置：页面背景色
            win.setBackgroundColor(0.1f, 0.1f, 0.15f);
            // 可选设置：目标帧率（30 FPS）
            win.setTargetFPS(30);
            // 可选设置：垂直同步
            win.setVsyncEnabled(true);

            // 标题组件
            win.addComponent(win.new UIComponent(0, 0, win.windowWidth, 50) {
                @Override
                public void render(long handle, boolean hovered) {
                    win.fontRenderer.drawText(handle, "演示窗口",
                            win.windowWidth / 2f, 30, 32, 1, 1, 1);
                }
            });

            // 音量滑块
            BaseGuiWindow.Slider volumeSlider = win.new Slider(350, 150, 300, 15, 0.7f, value -> {
                System.out.println("当前音量: " + Math.round(value * 100) + "%");
            });
            volumeSlider.setShowValue(true);
            volumeSlider.setValueFontSize(18);
            volumeSlider.setValueColor(0.8f, 0.9f, 1.0f);
            volumeSlider.setFillColor(0.2f, 0.8f, 0.6f);
            win.addComponent(volumeSlider);

            // 另一个滑块
            BaseGuiWindow.Slider effectSlider = win.new Slider(350, 170, 300, 15, 0.3f);
            effectSlider.setShowValue(false);
            effectSlider.setFillColor(0.9f, 0.6f, 0.2f);
            effectSlider.setChangeListener(val -> {
                System.out.println("特效强度: " + val);
            });
            win.addComponent(effectSlider);

            // 文本框
            BaseGuiWindow.TextField searchField = win.new TextField(50, 90, 600, 45,
                    "搜索...", 22, 0.6f, 0.8f, 1.0f);
            searchField.setPlaceholderColor(0.5f, 0.5f, 0.5f);
            searchField.setEnterListener(text -> System.out.println("回车搜索：" + text));
            win.addComponent(searchField);
            // 可选设置：初始焦点
            win.focusedComponent = searchField;

            // 按钮1（长文本自动截断）
            BaseGuiWindow.Button searchBtn = win.new Button(50, 150, 120, 40,
                    "这是一个非常非常长的搜索按钮文本",
                    () -> System.out.println("搜索：" + searchField.getText()), 20);
            win.addComponent(searchBtn);

            // 按钮2（彩色文字）
            BaseGuiWindow.Button colorBtn = win.new Button(200, 150, 120, 45,
                    "彩色按钮", () -> System.out.println("彩色按钮点击"), 28, 1.0f, 0.6f, 0.2f);
            win.addComponent(colorBtn);

            // 滚动容器
            BaseGuiWindow.ScrollContainer resultList = win.new ScrollContainer(50, 210, 600, 300);
            for (int i = 0; i < 50; i++) {
                int idx = i;
                BaseGuiWindow.Button entry = win.new Button(0, i * 45, 580, 40,
                        "条目 #" + i + " 详细信息", () -> System.out.println("查看详情 " + idx), 18);
                resultList.addChild(entry);
            }
            win.addComponent(resultList);
        });
    }
}
```

更多详情请查看 [GitHub 仓库](https://github.com/ohhapple/LWJGLwindows) 或加入社区讨论。
