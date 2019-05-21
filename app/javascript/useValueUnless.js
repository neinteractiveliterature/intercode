export default function useValueUnless(getValue, unlessCondition) {
  if (unlessCondition) {
    return null;
  }

  return getValue();
}
