import { Dispatch, SetStateAction } from 'react';

export default function useStatePropertyUpdater<T>(setState: Dispatch<SetStateAction<T>>) {
  return <F extends keyof T>(field: F) => (value: T[F]) => setState((state) => ({
    ...state, [field]: value,
  }));
}
