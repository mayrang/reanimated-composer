import { useMemo } from "react";
import {
  type AnimationPatternName,
  animationPatterns,
} from "../interaction/animation-patterns";
import { type AnimProps, useAnimation } from "./use-animation";

function mergeOverrides<T>(
  base: AnimProps<T>,
  overrides: AnimProps<T>
): AnimProps<T> {
  const result = { ...base };
  for (const key in overrides) {
    const propKey = key as keyof AnimProps<T>;
    if (
      result[propKey] &&
      typeof result[propKey] === "object" &&
      overrides[propKey] &&
      typeof overrides[propKey] === "object"
    ) {
      result[propKey] = { ...result[propKey], ...overrides[propKey] };
    } else {
      result[propKey] = overrides[propKey];
    }
  }
  return result;
}

interface UsePresetAnimationOptions<T> {
  trigger: T;
  onComplete?: () => void;
  overrides?: AnimProps<T>;
}

export function usePresetAnimation(
  patternName: AnimationPatternName,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  options: UsePresetAnimationOptions<any>
) {
  const { trigger, onComplete, overrides } = options;

  const basePattern = animationPatterns[patternName];

  const finalAnimations = useMemo(() => {
    if (!overrides) {
      return basePattern;
    }
    return mergeOverrides(basePattern, overrides);
  }, [basePattern, overrides]);

  return useAnimation({
    trigger,
    animations: finalAnimations,
    onComplete,
  });
}
