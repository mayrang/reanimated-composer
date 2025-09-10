# 🎼 React Composer

[![NPM Version](https://img.shields.io/npm/v/react-composer.svg)](https://www.npmjs.com/package/react-composer)
[![License](https://img.shields.io/npm/l/react-composer.svg)](https://github.com/mayrang/react-composer/blob/main/LICENSE)

A declarative and extensible animation system for React Native, designed for consistency and a great developer experience. Built on top of `react-native-reanimated`.

---

## Why React Composer?

While `react-native-reanimated` is incredibly powerful, using it directly often leads to complex, repetitive, and inconsistent code. React Composer transforms the way you think about animations - from imperative to **declarative**.

### 🔄 From Complex to Simple

**Before (Pure Reanimated):**

```tsx
const MyComponent = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
    }
  }, [isVisible]);

  // ... 30+ lines of boilerplate
};
```

**After (React Composer):**

```tsx
const MyComponent = () => {
  // Option 1: Use a preset
  const { animatedStyle } = usePresetAnimation("slideInUp", {
    trigger: isVisible,
  });

  // Option 2: Declare your own animation
  const { animatedStyle } = useAnimation({
    trigger: isVisible,
    animations: {
      opacity: { initial: 0, to: 1, duration: 300 },
      translateY: { initial: 50, to: 0, type: "spring" },
    },
  });
};
```

### ✨ Key Benefits

- **🧠 Declarative API:** Describe **what** should happen, not **how** to implement it
- **🎨 Preset Library:** 15+ battle-tested animations for consistent UX
- **🔧 Flexible Configuration:** Override any property while keeping the preset's essence
- **🚀 Zero Boilerplate:** No more `useSharedValue`, `useAnimatedStyle`, or `useEffect` repetition
- **📊 Built-in State Management:** Track animation progress, completion, and states automatically
- **🧩 Extensible Design:** Add your own presets following the Open/Closed Principle

---

## Installation

```bash
npm install react-composer
# or
yarn add react-composer
```

> **Note:** `react-composer` has peer dependencies on `react`, `react-native`, and `react-native-reanimated`. Please make sure they are installed in your project.

## Quick Start with Presets

Using a preset animation is as simple as choosing a name and providing a trigger.

```tsx
import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { usePresetAnimation } from "react-composer";

const MyComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

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
```

## Declarative Animation DSL

For complete control, use our **Animation DSL** - a declarative way to describe complex animations without the boilerplate.

### Basic Usage

```tsx
const { animatedStyle, reset, pause, getAnimationState } = useAnimation({
  trigger: isActive,
  animations: {
    opacity: {
      initial: 0,
      to: 1,
      duration: 500,
    },
    scale: {
      initial: 0.8,
      to: 1,
      type: "spring",
      config: { damping: 15, stiffness: 200 },
    },
  },
  onComplete: () => console.log("Animation finished!"),
});
```

### Advanced Patterns

**Sequence Animations:**

```tsx
animations: {
  translateX: {
    initial: 0,
    sequence: [
      { value: 100, duration: 200 },
      { value: -50, duration: 300 },
      { value: 0, duration: 200 }
    ]
  }
}
```

**Conditional Targets:**

```tsx
animations: {
  opacity: {
    initial: 0,
    to: (trigger) => trigger === 'show' ? 1 : trigger === 'dim' ? 0.5 : 0,
    duration: 300
  }
}
```

**Repeat & Delay:**

```tsx
animations: {
  rotate: {
    initial: 0,
    to: 360,
    duration: 1000,
    delay: 500,
    repeat: { count: 3, reverse: true }
  }
}
```

### Supported Properties

| Property     | Description         | Example Values          |
| :----------- | :------------------ | :---------------------- |
| `opacity`    | Transparency        | `0` to `1`              |
| `translateX` | Horizontal movement | `0`, `100`, `-50`       |
| `translateY` | Vertical movement   | `0`, `100`, `-50`       |
| `scale`      | Uniform scaling     | `0.5`, `1`, `2`         |
| `scaleX`     | Horizontal scaling  | `0.5`, `1`, `2`         |
| `scaleY`     | Vertical scaling    | `0.5`, `1`, `2`         |
| `rotate`     | Rotation in degrees | `0`, `90`, `180`, `360` |

## Available Presets

Choose from our curated collection of animations:

| Type         | Presets                                                                                   |
| :----------- | :---------------------------------------------------------------------------------------- |
| **Entrance** | `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `zoomIn`, `bounceIn` |
| **Emphasis** | `shake`, `pulse`, `jiggle`                                                                |
| **Exit**     | `fadeOut`, `slideOutUp`, `slideOutDown`, `slideOutLeft`, `slideOutRight`, `zoomOut`       |

### Customizing Presets

Start with a preset and fine-tune it for your needs:

```tsx
const { animatedStyle } = usePresetAnimation("slideInUp", {
  trigger: isVisible,
  overrides: {
    translateY: {
      initial: 100, // Slide from further down
      duration: 800, // Make it slower
    },
    opacity: {
      duration: 600, // Different fade timing
    },
  },
});
```

## Animation Control & State

Get full control over your animations:

```tsx
const { animatedStyle, reset, pause, getAnimationState, isAnimating } =
  useAnimation({
    trigger: isVisible,
    animations: {
      /* ... */
    },
    onAnimationStart: (key) => console.log(`${key} started`),
    onAnimationEnd: (key) => console.log(`${key} ended`),
    onComplete: () => console.log("All animations complete!"),
  });

// Control methods
const handleReset = () => reset(); // Reset to initial values
const handlePause = () => pause(); // Pause all animations

// State monitoring
const state = getAnimationState();
console.log(`Progress: ${state.progress * 100}%`);
console.log(`Running: ${state.isRunning}`);
```

## Real-World Examples

### Loading Button

```tsx
const LoadingButton = ({ onPress, loading }) => {
  const { animatedStyle } = useAnimation({
    trigger: loading,
    animations: {
      scale: {
        initial: 1,
        to: loading ? 0.95 : 1,
        type: "spring",
      },
      opacity: {
        initial: 1,
        to: loading ? 0.6 : 1,
      },
    },
  });

  return (
    <Animated.View style={[styles.button, animatedStyle]}>
      <Button title={loading ? "Loading..." : "Submit"} onPress={onPress} />
    </Animated.View>
  );
};
```

### Modal Entrance

```tsx
const Modal = ({ visible, children }) => {
  const { animatedStyle } = usePresetAnimation("slideInUp", {
    trigger: visible,
    overrides: {
      translateY: { initial: 300 }, // Slide from bottom of screen
    },
  });

  return visible ? (
    <Animated.View style={[styles.modal, animatedStyle]}>
      {children}
    </Animated.View>
  ) : null;
};
```

## API Reference

### `usePresetAnimation(patternName, options)`

**Parameters:**

- `patternName`: Name of the preset animation
- `options.trigger`: Value that triggers the animation
- `options.overrides`: Custom properties to override preset defaults
- `options.onComplete`: Callback when animation completes

### `useAnimation(config)`

**Parameters:**

- `config.trigger`: Value that triggers the animation
- `config.animations`: Object describing each property to animate
- `config.onComplete`: Callback when all animations complete
- `config.onAnimationStart`: Callback when individual animation starts
- `config.onAnimationEnd`: Callback when individual animation ends

**Returns:**

- `animatedStyle`: Style object for `Animated.View`
- `reset()`: Reset all animations to initial values
- `pause()`: Pause all running animations
- `getAnimationState()`: Get current animation progress and state
- `isAnimating`: Boolean indicating if any animation is running

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have any ideas or find a bug.

## License

This project is licensed under the **MIT License**.
