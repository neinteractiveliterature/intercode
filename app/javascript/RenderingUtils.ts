import { ReactNode } from 'react';
import flatMap from 'lodash/flatMap';

export function joinReact(array: ReactNode[], separator: ReactNode): ReactNode[] {
  const accumulator = (prev: ReactNode[] | null, curr: ReactNode) =>
    prev == null ? [curr] : [...prev, separator, curr];

  if (array.length > 1) {
    const result: ReactNode[] | null = array.reduce<ReactNode[] | null>(accumulator, null);

    return result ?? [];
  }

  return array;
}

export function arrayToSentenceReact(array: ReactNode[]): ReactNode[] {
  if (array.length < 2) {
    return array;
  }

  const head = array.slice(0, -1);
  const tail = array[array.length - 1];

  return [...flatMap(head, (item) => [item, ', ']), ' and ', tail];
}
