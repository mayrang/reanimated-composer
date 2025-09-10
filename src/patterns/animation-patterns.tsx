import { AnimProps } from "../types";

type PresetAnimation = AnimProps<boolean | number>;

const fadeIn: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 300 },
};

const slideInUp: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 400 },
  translateY: {
    initial: 50,
    to: (trigger) => (trigger ? 0 : 50),
    duration: 400,
  },
};

const slideInDown: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 400 },
  translateY: {
    initial: -50,
    to: (trigger) => (trigger ? 0 : -50),
    duration: 400,
  },
};

const slideInLeft: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 400 },
  translateX: {
    initial: -50,
    to: (trigger) => (trigger ? 0 : -50),
    duration: 400,
  },
};

const slideInRight: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 400 },
  translateX: {
    initial: 50,
    to: (trigger) => (trigger ? 0 : 50),
    duration: 400,
  },
};

const zoomIn: PresetAnimation = {
  opacity: { initial: 0, to: (trigger) => (trigger ? 1 : 0), duration: 300 },
  scale: { initial: 0.8, to: (trigger) => (trigger ? 1 : 0.8), duration: 300 },
};

const bounceIn: PresetAnimation = {
  scale: {
    initial: 0.5,
    to: (trigger) => (trigger ? 1 : 0.5),
    type: "spring",
    config: { damping: 12, stiffness: 200 },
  },
};

// --- 강조 (Emphasis) ---

const shake: PresetAnimation = {
  translateX: { initial: 0, sequence: [0, -8, 8, -4, 4, 0], duration: 50 },
};

const pulse: PresetAnimation = {
  scale: {
    initial: 1,
    sequence: [1, 1.05, 1],
    duration: 400,
    repeat: { count: -1 },
  },
};

const jiggle: PresetAnimation = {
  rotate: { initial: 0, sequence: [0, -3, 3, -2, 2, 0], duration: 80 },
};

// --- 퇴장 (Exit) ---

const fadeOut: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 300 },
};

const slideOutUp: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 400 },
  translateY: {
    initial: 0,
    to: (trigger) => (trigger ? -50 : 0),
    duration: 400,
  },
};

const slideOutDown: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 400 },
  translateY: {
    initial: 0,
    to: (trigger) => (trigger ? 50 : 0),
    duration: 400,
  },
};

const slideOutLeft: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 400 },
  translateX: {
    initial: 0,
    to: (trigger) => (trigger ? -50 : 0),
    duration: 400,
  },
};

const slideOutRight: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 400 },
  translateX: {
    initial: 0,
    to: (trigger) => (trigger ? 50 : 0),
    duration: 400,
  },
};

const zoomOut: PresetAnimation = {
  opacity: { initial: 1, to: (trigger) => (trigger ? 0 : 1), duration: 300 },
  scale: { initial: 1, to: (trigger) => (trigger ? 0.8 : 1), duration: 300 },
};

// --- 레지스트리 ---

export const animationPatterns = {
  fadeIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  zoomIn,
  bounceIn,
  shake,
  pulse,
  jiggle,
  fadeOut,
  slideOutUp,
  slideOutDown,
  slideOutLeft,
  slideOutRight,
  zoomOut,
};

export type AnimationPatternName = keyof typeof animationPatterns;
