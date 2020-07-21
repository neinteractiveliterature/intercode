import escapeRegExp from 'lodash/escapeRegExp';

export const onlyOneIsNull = (a: any, b: any) => (
  (a == null && b != null)
  || (a != null && b == null)
);

export function chooseAmong<T>(
  values: T[],
  sortFunction: (a: T, b: T) => number,
  allowNull?: boolean,
) {
  let eligibleValues = values;

  if (!allowNull) {
    eligibleValues = values.filter((value) => value != null);
  }

  return eligibleValues.sort(sortFunction)[0];
}

export const preferNull = <T>(sortFunction: (a: T, b: T) => number) => (a: T, b: T) => {
  if (a == null) {
    return -1;
  }

  if (b == null) {
    return 1;
  }

  return sortFunction(a, b);
};

export function sortByLocaleString<T>(
  list: T[],
  transform: (item: T) => string,
  options: Intl.CollatorOptions = { sensitivity: 'base' },
) {
  return [...list].sort((a, b) => transform(a).localeCompare(transform(b), undefined, options));
}

export function normalizeTitle(title: string) {
  return title.normalize('NFD') // not exactly unaccent but will make the diacritics separate chars
    .replace(/[^0-9a-z ]/gi, '')
    .trim().replace(/^(the|a|an) /i, '')
    .replace(/ /g, '');
}

export function titleSort<T>(list: T[], transform?: (item: T) => string) {
  const effectiveTransform = transform ?? ((e) => String(e));
  return sortByLocaleString(
    list,
    (element) => normalizeTitle(effectiveTransform(element)),
  );
}

export function findCommonArrayPrefix<T>(a: T[], b: T[]) {
  let i = 0;
  const prefix: T[] = [];

  while (i < a.length && i < b.length) {
    if (a[i] !== b[i]) {
      break;
    }

    prefix.push(a[i]);
    i += 1;
  }

  return prefix;
}

export function findCommonStringPrefix(a: string, b: string, delimiter = '') {
  const aArray = a.split(delimiter);
  const bArray = b.split(delimiter);

  return findCommonArrayPrefix(aArray, bArray).join(delimiter);
}

export function findCommonStringSuffix(a: string, b: string, delimiter = '') {
  const aArray = a.split(delimiter).reverse();
  const bArray = b.split(delimiter).reverse();

  return findCommonArrayPrefix(aArray, bArray).reverse().join(delimiter);
}

export function removeCommonStringMiddle(a: string, b: string, delimiter = '') {
  const prefix = findCommonStringPrefix(a, b, delimiter);
  const suffix = findCommonStringSuffix(a, b, delimiter);
  const prefixRegExp = new RegExp(`^${escapeRegExp(prefix)}`);
  const suffixRegExp = new RegExp(`${escapeRegExp(suffix)}$`);

  return [a.replace(suffixRegExp, '').trim(), b.replace(prefixRegExp, '').trim()];
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
