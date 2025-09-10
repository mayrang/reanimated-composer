import { useCallback, useEffect, useMemo, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  runOnJS,
  cancelAnimation,
  type SharedValue,
} from "react-native-reanimated";

export type AnimType = "timing" | "spring" | "delay";

export type SpringConfig = {
  damping?: number;
  stiffness?: number;
  mass?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
};

export type TimingConfig = {
  duration?: number;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  easing?: any;
};

export type Keyframe = {
  value: number;
  duration?: number;
  delay?: number;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnimConfig<T = any> = {
  initial?: number;
  to?: number | ((trigger: T) => number);
  type?: AnimType;
  duration?: number;
  delay?: number;
  config?: SpringConfig | TimingConfig;
  sequence?: (number | Keyframe)[];
  repeat?: { count: number; reverse?: boolean };
};

export type SupportedAnimKeys =
  | "opacity"
  | "translateX"
  | "translateY"
  | "scale"
  | "scaleX"
  | "scaleY"
  | "rotate";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnimProps<T = any> = Partial<
  Record<SupportedAnimKeys, AnimConfig<T>>
>;

export type AnimationState = {
  isRunning: boolean;
  completedAnimations: Set<string>;
  totalAnimations: number;
};

export function useAnimation<T>({
  trigger,
  animations,
  onComplete,
  onAnimationStart,
  onAnimationEnd,
}: {
  trigger: T;
  animations: AnimProps<T>;
  onComplete?: () => void;
  onAnimationStart?: (key: string) => void;
  onAnimationEnd?: (key: string) => void;
}) {
  const animationState = useRef<AnimationState>({
    isRunning: false,
    completedAnimations: new Set(),
    totalAnimations: 0,
  });

  const completionTimeoutsRef = useRef<Set<number>>(new Set());

  const opacity = useSharedValue(animations.opacity?.initial ?? 1);
  const translateX = useSharedValue(animations.translateX?.initial ?? 0);
  const translateY = useSharedValue(animations.translateY?.initial ?? 0);
  const scale = useSharedValue(animations.scale?.initial ?? 1);
  const scaleX = useSharedValue(animations.scaleX?.initial ?? 1);
  const scaleY = useSharedValue(animations.scaleY?.initial ?? 1);
  const rotate = useSharedValue(animations.rotate?.initial ?? 0);

  const sharedValues: Record<SupportedAnimKeys, SharedValue<number>> = useMemo(
    () => ({
      opacity,
      translateX,
      translateY,
      scale,
      scaleX,
      scaleY,
      rotate,
    }),
    [opacity, translateX, translateY, scale, scaleX, scaleY, rotate]
  );

  const handleAnimationComplete = useCallback(
    (key: string) => {
      animationState.current.completedAnimations.add(key);

      if (onAnimationEnd) {
        runOnJS(onAnimationEnd)(key);
      }

      if (
        animationState.current.completedAnimations.size ===
        animationState.current.totalAnimations
      ) {
        animationState.current.isRunning = false;
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }
    },
    [onComplete, onAnimationEnd]
  );

  const calculateAnimationDuration = useCallback(
    (cfg: AnimConfig<T>): number => {
      let baseDuration: number;

      if (cfg.sequence) {
        baseDuration = cfg.sequence.reduce<number>((total, frame) => {
          if (typeof frame === "number") {
            return total + (cfg.duration ?? 300);
          }
          return (
            total + (frame.duration ?? cfg.duration ?? 300) + (frame.delay ?? 0)
          );
        }, 0);
      } else {
        baseDuration = (cfg.duration ?? 300) + (cfg.delay ?? 0);
      }

      if (cfg.repeat && cfg.repeat.count !== -1) {
        return baseDuration * cfg.repeat.count;
      }

      return baseDuration;
    },
    []
  );

  const runAnimation = useCallback(
    (key: SupportedAnimKeys, cfg: AnimConfig<T>) => {
      const target =
        typeof cfg.to === "function"
          ? cfg.to(trigger)
          : cfg.to ??
            (typeof trigger === "boolean"
              ? trigger
                ? 1
                : 0
              : Number(trigger));

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let anim: any;

      if (onAnimationStart) {
        runOnJS(onAnimationStart)(key);
      }

      if (cfg.sequence) {
        const frames = cfg.sequence.map((frame) =>
          typeof frame === "number"
            ? withTiming(frame, {
                duration: cfg.duration ?? 300,
                ...(cfg.config as TimingConfig),
              })
            : withTiming(frame.value, {
                duration: frame.duration ?? cfg.duration ?? 300,
                ...(cfg.config as TimingConfig),
              })
        );
        anim = withSequence(...frames);
      } else {
        if (cfg.type === "spring") {
          anim = withSpring(target, cfg.config as SpringConfig);
        } else {
          anim = withTiming(target, {
            duration: cfg.duration ?? 300,
            ...(cfg.config as TimingConfig),
          });
        }

        if (cfg.delay) {
          anim = withDelay(cfg.delay, anim);
        }
      }

      if (cfg.repeat) {
        anim = withRepeat(anim, cfg.repeat.count, cfg.repeat.reverse ?? false);
      }

      sharedValues[key].value = anim;

      if (!cfg.repeat || cfg.repeat.count !== -1) {
        const duration = calculateAnimationDuration(cfg);
        const timeout = setTimeout(() => {
          handleAnimationComplete(key);
        }, duration);

        completionTimeoutsRef.current.add(timeout);
      } else {
        handleAnimationComplete(key);
      }
    },
    [
      trigger,
      sharedValues,
      calculateAnimationDuration,
      handleAnimationComplete,
      onAnimationStart,
    ]
  );

  useEffect(() => {
    for (const key in animations) {
      const animKey = key as SupportedAnimKeys;
      const initialValue = animations[animKey]?.initial;
      if (initialValue !== undefined) {
        sharedValues[animKey].value = initialValue;
      }
    }
  }, [animations, sharedValues]);

  useEffect(() => {
    completionTimeoutsRef.current.forEach(clearTimeout);
    completionTimeoutsRef.current.clear();

    const activeAnimations = Object.keys(animations).filter(
      (key) => animations[key as SupportedAnimKeys] !== undefined
    );

    if (activeAnimations.length === 0) return;

    animationState.current = {
      isRunning: true,
      completedAnimations: new Set(),
      totalAnimations: activeAnimations.length,
    };

    for (const key of activeAnimations) {
      const animKey = key as SupportedAnimKeys;
      const config = animations[animKey];
      if (config) {
        runAnimation(animKey, config);
      }
    }

    return () => {
      completionTimeoutsRef.current.forEach(clearTimeout);
      completionTimeoutsRef.current.clear();
    };
  }, [trigger, animations, runAnimation]);

  const animatedStyle = useAnimatedStyle(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const style: any = {};
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const transforms: any[] = [];

    if (animations.opacity) {
      style.opacity = opacity.value;
    }
    if (animations.translateX) {
      transforms.push({ translateX: translateX.value });
    }
    if (animations.translateY) {
      transforms.push({ translateY: translateY.value });
    }
    if (animations.scale) {
      transforms.push({ scale: scale.value });
    }
    if (animations.scaleX) {
      transforms.push({ scaleX: scaleX.value });
    }
    if (animations.scaleY) {
      transforms.push({ scaleY: scaleY.value });
    }
    if (animations.rotate) {
      transforms.push({ rotate: `${rotate.value}deg` });
    }

    if (transforms.length > 0) {
      style.transform = transforms;
    }

    return style;
  }, [
    animations.opacity,
    opacity.value,
    animations.translateX,
    translateX.value,
    animations.translateY,
    translateY.value,
    animations.scale,
    scale.value,
    animations.scaleX,
    scaleX.value,
    animations.scaleY,
    scaleY.value,
    animations.rotate,
    rotate.value,
  ]);

  const reset = useCallback(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(sharedValues).forEach(([key, sharedValue]) => {
      const animKey = key as SupportedAnimKeys;
      cancelAnimation(sharedValue);
      const initialValue = animations[animKey]?.initial;
      if (initialValue !== undefined) {
        sharedValue.value = initialValue;
      }
    });

    completionTimeoutsRef.current.forEach(clearTimeout);
    completionTimeoutsRef.current.clear();

    animationState.current = {
      isRunning: false,
      completedAnimations: new Set(),
      totalAnimations: 0,
    };
  }, [sharedValues, animations]);

  const pause = useCallback(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.values(sharedValues).forEach((sharedValue) => {
      cancelAnimation(sharedValue);
    });
  }, [sharedValues]);

  const getAnimationState = useCallback(
    () => ({
      isRunning: animationState.current.isRunning,
      completedCount: animationState.current.completedAnimations.size,
      totalCount: animationState.current.totalAnimations,
      progress:
        animationState.current.totalAnimations > 0
          ? animationState.current.completedAnimations.size /
            animationState.current.totalAnimations
          : 0,
    }),
    []
  );

  return {
    animatedStyle,
    sharedValues,
    reset,
    pause,
    getAnimationState,
    isAnimating: animationState.current.isRunning,
  };
}
