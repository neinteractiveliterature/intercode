export default function useValueUnless<T>(getValue: () => T, unlessCondition: any) {
  if (unlessCondition) {
    return undefined;
  }

  return getValue();
}
