export const onlyOneIsNull = (a, b) => (
  (a == null && b != null) ||
  (a != null && b == null)
);

export const chooseAmong = (values, sortFunction) => {
  const nonNullValues = values.filter(value => value != null);
  return nonNullValues.sort(sortFunction)[0];
};
