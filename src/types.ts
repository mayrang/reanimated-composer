export type AnimType = "timing" | "spring" | "delay";

export type UseAnimationProps<T> = {
  trigger: T;
  animations: AnimProps<T>;
  onComplete?: () => void;
  onAnimationStart?: (key: string) => void;
  onAnimationEnd?: (key: string) => void;
};

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