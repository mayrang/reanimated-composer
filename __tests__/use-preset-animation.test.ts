import { renderHook } from '@testing-library/react-native';
import { usePresetAnimation } from '../src/hooks/use-preset-animation';
import { useAnimation } from '../src/hooks/use-animation';

jest.mock('../src/hooks/use-animation', () => ({
  useAnimation: jest.fn(),
}));

const mockedUseAnimation = useAnimation as jest.Mock;

describe('usePresetAnimation', () => {
  beforeEach(() => {
    mockedUseAnimation.mockClear();
  });

  it('should call useAnimation with the correct base pattern', () => {
    renderHook(() => usePresetAnimation('fadeIn', { trigger: true }));

    expect(mockedUseAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        animations: expect.objectContaining({
          opacity: expect.objectContaining({ duration: 300 }),
        }),
      })
    );
  });

  it('should correctly merge overrides with the base pattern', () => {
    const overrides = {
      opacity: { duration: 1000 },
    };
    renderHook(() => usePresetAnimation('fadeIn', { trigger: false, overrides }));

    expect(mockedUseAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        animations: expect.objectContaining({
          opacity: expect.objectContaining({ duration: 1000 }),
        }),
      })
    );
  });
});