export const onlyOneIsNull = (a, b) => (
  (a == null && b != null)
  || (a != null && b == null)
);

export const chooseAmong = (values, sortFunction, allowNull) => {
  let eligibleValues = values;

  if (!allowNull) {
    eligibleValues = values.filter((value) => value != null);
  }

  return eligibleValues.sort(sortFunction)[0];
};

export const preferNull = (sortFunction) => (a, b) => {
  if (a == null) {
    return -1;
  }

  if (b == null) {
    return 1;
  }

  return sortFunction(a, b);
};

export function sortByLocaleString(list, transform, options = { sensitivity: 'base' }) {
  return [...list].sort((a, b) => transform(a).localeCompare(transform(b), options));
}

export function titleSort(list, transform) {
  return sortByLocaleString(
    list,
    (element) => (transform || ((e) => e))(element).replace(/^(the|a) /i, '').replace(/\W/, ''),
  );
}
