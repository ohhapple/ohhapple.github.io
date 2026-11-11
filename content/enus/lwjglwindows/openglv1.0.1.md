---
title: LWJGLwindows openglv1.0.1 Documentation
description: A LWJGL window wrapper library for creating independent windows in Minecraft, designed to avoid frequent custom GUI changes caused by native GUI class differences such as Screen across Minecraft versions.
collection: lwjglwindows
cardOrder: 2
cardDescription: Release Date: 2026-02-21<br>Removed dependency on the Minecraft client instance
---
### 📦 Quick Start

- Project repository: [GitHub repository](https://github.com/ohhapple/LWJGLwindows)
- If you encounter problems, submit [GitHub Issues](https://github.com/ohhapple/LWJGLwindows/issues)
- Use the latest version. Tags are ordered by time; each tag represents a version and the tag name is the version number
- This library is published on JitPack. Add the JitPack repository in Gradle: `maven { url 'https://jitpack.io' }`
- Add the dependency: `implementation 'com.github.ohhapple:LWJGLwindows:version'`
- To include it in the jar: `include 'com.github.ohhapple:LWJGLwindows:version'`
- Or add: `include(implementation("com.github.ohhapple:LWJGLwindows:version"))`

### ✨ Key Features

- Adapt to multi-version GUI window creation without modifying code

### 🚀 Changelog

- Removed dependency on the Minecraft client instance; no Minecraft client instance needs to be passed, preparing for the future deprecation of OpenGL in MC
- If MC eventually deprecates OpenGL completely, developers can manually add OpenGL in Gradle and this library should still work
- Example: `implementation "org.lwjgl:lwjgl-opengl:3.3.3"`
- Windows runtime: `runtimeOnly "org.lwjgl:lwjgl-opengl::natives-windows:3.3.3"`
- Linux runtime: `runtimeOnly "org.lwjgl:lwjgl-opengl::natives-linux:3.3.3"`
- macOS runtime: `runtimeOnly "org.lwjgl:lwjgl-opengl::natives-macos:3.3.3"`
- Added a blocking method to close all windows: `GuiWindows.shutdown()`

### 📝 Partial Constructors

- Narrow full-parameter constructors; overloads with defaults can also be used
- A full-parameter constructor does not represent every parameter of a UI component. Some values have defaults that can be changed with setters
- Prefer overloads with fewer parameters and configure components through their setter methods
- In most cases the defaults are suitable, but feel free to explore

```java
// Text field
public TextField(int x, int y, int w, int h, String p, int fontSize,
                 float tr, float tg, float tb,
                 float pr, float pg, float pb,
                 float bgR, float bgG, float bgB,
                 float borderR, float borderG, float borderB,
                 float borderHoverR, float borderHoverG, float borderHoverB,
                 float borderFocusR, float borderFocusG, float borderFocusB)

// Slider
public Slider(int x, int y, int width, int height, float initialValue, Consumer<Float> listener,
              float trackR, float trackG, float trackB,
              float fillR, float fillG, float fillB,
              float thumbR, float thumbG, float thumbB,
              float thumbHoverR, float thumbHoverG, float thumbHoverB,
              Integer trackHeight, Integer thumbWidth, Integer thumbHeight,
              boolean showValue, int valFontSize, float valR, float valG, float valB)

// Button
public Button(int x, int y, int w, int h, String t, Runnable a,
              int fontSize, float tr, float tg, float tb,
              float bgR, float bgG, float bgB,
              float bgHoverR, float bgHoverG, float bgHoverB,
              float borderR, float borderG, float borderB,
              float borderHoverR, float borderHoverG, float borderHoverB)

// Scroll container
public ScrollContainer(int x, int y, int w, int h,
                       float bgR, float bgG, float bgB,
                       float borderR, float borderG, float borderB)
```

### 📝 Example

- This example is based on debug code in the CarpetPlus project and is for demonstration only
- In production, the window manager is commonly implemented as a singleton
- When leaving a world, call `GuiWindows.shutdown()` (blocking) or `GuiWindows.closeAllwindows()` (non-blocking) to close all windows safely

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
        BaseGuiWindow.setWindowIcon("/assets/carpetplus/icon.png");

        GuiWindows.open("Demo", 700, 600, win -> {
            win.setBackgroundColor(0.1f, 0.1f, 0.15f);
            win.setTargetFPS(30);
            win.setVsyncEnabled(true);

            win.addComponent(win.new UIComponent(0, 0, win.windowWidth, 50) {
                @Override
                public void render(long handle, boolean hovered) {
                    win.fontRenderer.drawText(handle, "Demo",
                            win.windowWidth / 2f, 30, 32, 1, 1, 1);
                }
            });

            BaseGuiWindow.Slider volumeSlider = win.new Slider(350, 150, 300, 15, 0.7f, value -> {
                System.out.println("Volume: " + Math.round(value * 100) + "%");
            });
            volumeSlider.setShowValue(true);
            volumeSlider.setValueFontSize(18);
            volumeSlider.setValueColor(0.8f, 0.9f, 1.0f);
            volumeSlider.setFillColor(0.2f, 0.8f, 0.6f);
            win.addComponent(volumeSlider);

            BaseGuiWindow.Slider effectSlider = win.new Slider(350, 170, 300, 15, 0.3f);
            effectSlider.setShowValue(false);
            effectSlider.setFillColor(0.9f, 0.6f, 0.2f);
            effectSlider.setChangeListener(value -> System.out.println("Effect: " + value));
            win.addComponent(effectSlider);

            BaseGuiWindow.TextField searchField = win.new TextField(50, 90, 600, 45,
                    "Search...", 22, 0.6f, 0.8f, 1.0f);
            searchField.setPlaceholderColor(0.5f, 0.5f, 0.5f);
            searchField.setEnterListener(text -> System.out.println("Search: " + text));
            win.addComponent(searchField);
            win.focusedComponent = searchField;

            BaseGuiWindow.Button searchBtn = win.new Button(50, 150, 120, 40,
                    "A very long search button label",
                    () -> System.out.println("Search: " + searchField.getText()), 20);
            win.addComponent(searchBtn);

            BaseGuiWindow.Button colorBtn = win.new Button(200, 150, 120, 45,
                    "Color", () -> System.out.println("Clicked"), 28, 1.0f, 0.6f, 0.2f);
            win.addComponent(colorBtn);

            BaseGuiWindow.ScrollContainer resultList = win.new ScrollContainer(50, 210, 600, 300);
            for (int i = 0; i < 50; i++) {
                int index = i;
                BaseGuiWindow.Button entry = win.new Button(0, i * 45, 580, 40,
                        "Item #" + i, () -> System.out.println("Open " + index), 18);
                resultList.addChild(entry);
            }
            win.addComponent(resultList);
        });
    }
}
```

For more details, see the [GitHub repository](https://github.com/ohhapple/LWJGLwindows) or join the community discussion.
