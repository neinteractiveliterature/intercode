export default function useValueUnless<T>(
  getValue: () => T,
  unlessCondition: unknown,
): T | undefined {
  if (unlessCondition) {
    return undefined;
  }

  return getValue();
}
