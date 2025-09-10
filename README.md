# 🎼 React Composer

[![NPM Version](https://img.shields.io/npm/v/react-composer.svg)](https://www.npmjs.com/package/react-composer)
[![License](https://img.shields.io/npm/l/react-composer.svg)](https://github.com/mayrang/react-composer/blob/main/LICENSE)

A declarative and extensible animation system for React, designed for consistency and a great developer experience. Built on top of `react-native-reanimated`.

---

## Why React Composer?

While `react-native-reanimated` is a powerful animation library, using it directly often leads to complex, repetitive, and inconsistent code. React Composer is a high-level abstraction designed to solve these exact problems.

- **🧠 Declarative API:** Describe **what** your animation should look like with a simple configuration object. No more wrestling with hooks and boilerplate for every animation.
- **🎨 Preset-driven:** Comes with a rich set of pre-configured animations (`fadeIn`, `shake`, `slideInUp`, etc.) to ensure a consistent look and feel across your entire application.
- **🧩 Extensible by Design:** Easily add your own project-specific animation presets without modifying the core logic, thanks to the Open/Closed Principle.
- **💪 Flexible Overrides:** Use a preset as a starting point and easily override any value (`duration`, `initial` value, etc.) to fit your specific needs.

## Installation

```bash
npm install react-composer
# or
yarn add react-composer
```

> **Note:** `react-composer` has peer dependencies on `react`, `react-native`, and `react-native-reanimated`. Please make sure they are installed in your project.

## Quick Start

Using a preset animation is as simple as choosing a name and providing a trigger.

```tsx
import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { usePresetAnimation } from "react-composer";

const MyComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 1. Choose a preset name ('slideInUp')
  // 2. Provide a trigger (the `isVisible` state)
  const { animatedStyle } = usePresetAnimation("slideInUp", {
    trigger: isVisible,
  });

  return (
    <View style={styles.container}>
      <Button
        title="Toggle Animation"
        onPress={() => setIsVisible((v) => !v)}
      />
      {isVisible && <Animated.View style={[styles.box, animatedStyle]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "tomato",
    marginTop: 20,
  },
});
```

## Usage

### `usePresetAnimation`

This is the main hook you'll use in your application.

```ts
const { animatedStyle, reset } = usePresetAnimation(patternName, options);
```

**Parameters:**

- `patternName`: The name of the preset to use (e.g., `'fadeIn'`).
- `options`: An object with the following properties:
  - `trigger` (**required**): A value that triggers the animation when it changes.
  - `overrides`: An optional object to customize the preset's behavior.
  - `onComplete`: An optional callback that fires when the animation finishes.

### Available Presets

You can use any of the following names for `patternName`:

| Type         | Presets                                                                                   |
|:-------------|:------------------------------------------------------------------------------------------|
| **Entrance** | `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `zoomIn`, `bounceIn` |
| **Emphasis** | `shake`, `pulse`, `jiggle`                                                                |
| **Exit**     | `fadeOut`, `slideOutUp`, `slideOutDown`, `slideOutLeft`, `slideOutRight`, `zoomOut`       |

### Customizing Presets with `overrides`

Use a preset as a base and tweak any value you need.

```tsx
const { animatedStyle } = usePresetAnimation("slideInUp", {
  trigger: isVisible,
  overrides: {
    // Make it slide from further down and take longer
    translateY: {
      initial: 100, // Default is 50
      duration: 800, // Default is 400
    },
    // Also make the fade-in slower
    opacity: {
      duration: 800,
    },
  },
});
```

## Advanced API: `useAnimation`

For complex, one-off animations that don't fit a preset, you can use the low-level `useAnimation` hook. It accepts a detailed animation configuration object.

> See the full API documentation for `useAnimation` [here](./docs/useAnimation.md).

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have any ideas or find a bug.

## License

This project is licensed under the **MIT License**.

