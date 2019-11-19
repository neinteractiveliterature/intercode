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

export function normalizeTitle(title) {
  return title.normalize('NFD') // not exactly unaccent but will make the diacritics separate chars
    .replace(/[^0-9a-z ]/gi, '')
    .trim().replace(/^(the|a|an) /i, '')
    .replace(/ /g, '');
}

export function titleSort(list, transform) {
  return sortByLocaleString(
    list,
    (element) => normalizeTitle((transform || ((e) => e))(element)),
  );
}
