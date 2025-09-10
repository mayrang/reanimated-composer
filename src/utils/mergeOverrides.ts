import { AnimProps } from "../types";

export function mergeOverrides<T>(
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