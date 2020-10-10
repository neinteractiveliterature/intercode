import { Dispatch, SetStateAction, useCallback } from 'react';

export default function useStatePropertyUpdater<T>(setState: Dispatch<SetStateAction<T>>) {
  return <F extends keyof T>(field: F) => (value: T[F]) =>
    setState((state) => ({
      ...state,
      [field]: value,
    }));
}

export function usePartialState<T, F extends keyof T>(
  state: T,
  setState: Dispatch<SetStateAction<T>> | undefined,
  property: F,
) {
  const propertyValue = state[property];
  const setProperty = useCallback(
    (valueOrUpdater: SetStateAction<T[F]>) => {
      if (setState == null) {
        return;
      }

      setState((prevState) => {
        if (typeof valueOrUpdater === 'function') {
          return {
            ...prevState,
            [property]: (valueOrUpdater as React.Dispatch<T[F]>)(state[property]),
          };
        }

        return { ...prevState, [property]: valueOrUpdater };
      });
    },
    [property, state, setState],
  );

  return [propertyValue, setProperty] as const;
}
