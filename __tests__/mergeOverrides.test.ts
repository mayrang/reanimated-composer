import { AnimProps } from '../src/types';
import { mergeOverrides } from '../src/utils/mergeOverrides';

describe('mergeOverrides', () => {
  const basePattern: AnimProps<boolean> = {
    opacity: { initial: 0, duration: 300 },
    translateY: { initial: 50, duration: 400 },
  };

  it('should return the base pattern if overrides are not provided', () => {
    const result = mergeOverrides(basePattern, {});
    expect(result).toEqual(basePattern);
  });

  it('should override a nested property correctly', () => {
    const overrides: AnimProps<boolean> = {
      opacity: { duration: 1000 },
    };
    const result = mergeOverrides(basePattern, overrides);

    expect(result.opacity).toBeDefined();

    expect(result.opacity?.duration).toBe(1000);
    expect(result.opacity?.initial).toBe(0);
  });

  it('should add a new property', () => {
    const overrides: AnimProps<boolean> = {
      scale: { initial: 1, to: 1.5 },
    };
    const result = mergeOverrides(basePattern, overrides);

    expect(result.scale).toBeDefined();
    expect(result.scale?.to).toBe(1.5);
    
    expect(result.opacity).toBeDefined();
    expect(result.opacity?.duration).toBe(300);
  });
});