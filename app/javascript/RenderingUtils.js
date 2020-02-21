import flatMap from 'lodash/flatMap';

export function joinReact(array, separator) {
  if (array.length > 1) {
    return array.reduce((prev, curr) => (prev == null ? [curr] : [...prev, separator, curr]), null);
  }

  return array;
}

export function arrayToSentenceReact(array) {
  if (array.length < 2) {
    return array;
  }

  const head = array.slice(0, -1);
  const tail = array[array.length - 1];

  return [...flatMap(head, (item) => [item, ', ']), ' and ', tail];
}
