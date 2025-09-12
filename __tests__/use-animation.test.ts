import { renderHook, act } from '@testing-library/react-native';
import { useAnimation } from '../src/hooks/use-animation';
import * as Reanimated from 'react-native-reanimated';
import { UseAnimationProps } from '../src/types';

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn((styleFn) => styleFn()),
  withTiming: jest.fn((toValue) => toValue),
  withSpring: jest.fn((toValue) => toValue),
  runOnJS: jest.fn((fn) => fn),
}));


jest.useFakeTimers();

describe('useAnimation', () => {
  beforeEach(() => {
    (Reanimated.withTiming as jest.Mock).mockClear();
    (Reanimated.withSpring as jest.Mock).mockClear();
  });

  it('should call withTiming by default when trigger changes', () => {
    const initialProps:UseAnimationProps<boolean> = {
      trigger: false,
      animations: {
        opacity: { initial: 0, to: (trigger: boolean) => (trigger ? 1 : 0) },
      },
    };

    const { rerender } = renderHook((props:UseAnimationProps<boolean>) => useAnimation(props), {
      initialProps,
    });
    rerender({ ...initialProps, trigger: true });

    expect(Reanimated.withTiming).toHaveBeenCalledWith(1, expect.any(Object));
    expect(Reanimated.withSpring).not.toHaveBeenCalled();
  });

  it('should call withSpring when type is "spring"', () => {
    const initialProps:UseAnimationProps<boolean> = {
      trigger: false,
      animations: {
        scale: { initial: 1, to: 1.5, type: 'spring' as const },
      },
    };

    const { rerender } = renderHook((props:UseAnimationProps<boolean>) => useAnimation(props), {
      initialProps,
    });
    rerender({ ...initialProps, trigger: true });

    expect(Reanimated.withSpring).toHaveBeenCalledWith(1.5, undefined);
    expect(Reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('should call onComplete after the animation duration', () => {
    const onComplete = jest.fn();
    const props = {
      trigger: false, // trigger: true에서 false로 변경하여 테스트
      animations: {
        opacity: { initial: 0, to: 1, duration: 500 },
      },
      onComplete,
    };

    const { rerender } = renderHook((p:UseAnimationProps<boolean>) => useAnimation(p), { initialProps: props });
    rerender({ ...props, trigger: true });

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('should use enter and exit configurations for bidirectional animations', () => {
    const initialProps: UseAnimationProps<boolean> = {
      trigger: false,
      animations: {
        opacity: {
          initial: 0,
          to: 1,
          duration: 999,
          enter: { type: 'spring' as const },
          exit: { duration: 500 },
        },
      },
    };

    const { rerender } = renderHook((props:UseAnimationProps<boolean>) => useAnimation(props), {
      initialProps,
    });

    rerender({ ...initialProps, trigger: true });

    expect(Reanimated.withSpring).toHaveBeenCalledWith(1, undefined);
    expect(Reanimated.withTiming).not.toHaveBeenCalled();

    (Reanimated.withSpring as jest.Mock).mockClear();

    rerender({ ...initialProps, trigger: false });

    expect(Reanimated.withTiming).toHaveBeenCalledWith(0, { duration: 500 });
    expect(Reanimated.withSpring).not.toHaveBeenCalled();
  });

  it('should run animation on mount when animateOnMount is true', () => {
    const props: UseAnimationProps<boolean> = {
      trigger: false,
      animateOnMount: true,
      animations: {
        opacity: {
          initial: 0,
          to: 1,
          exit: { duration: 500 },
        },
      },
    };

    renderHook(() => useAnimation(props));

    expect(Reanimated.withTiming).toHaveBeenCalledWith(0, { duration: 500 });
  });
});