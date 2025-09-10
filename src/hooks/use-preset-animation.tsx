import { useMemo } from "react";
import {
  type AnimationPatternName,
  animationPatterns,
} from "../patterns/animation-patterns";
import { useAnimation } from "./use-animation";
import { AnimProps } from "../types";
import { mergeOverrides } from "../utils/mergeOverrides";

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
