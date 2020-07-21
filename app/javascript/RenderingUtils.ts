import { ReactNode } from 'react';
import flatMap from 'lodash/flatMap';

export function joinReact(array: ReactNode[], separator: ReactNode) {
  if (array.length > 1) {
    return array.reduce(
      (prev: ReactNode[] | null, curr) => (prev == null ? [curr] : [...prev, separator, curr]),
      null,
    );
  }

  return array;
}

export function arrayToSentenceReact(array: ReactNode[]) {
  if (array.length < 2) {
    return array;
  }

  const head = array.slice(0, -1);
  const tail = array[array.length - 1];

  return [...flatMap(head, (item) => [item, ', ']), ' and ', tail];
}
