export default function useValueUnless<T>(getValue: () => T, unlessCondition: any): T | undefined {
  if (unlessCondition) {
    return undefined;
  }

  return getValue();
}
