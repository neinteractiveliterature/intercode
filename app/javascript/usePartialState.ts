import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

export type PartialStateFactory<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
};

export function usePartialStateFactory<T>(
  state: T,
  setState: Dispatch<SetStateAction<T>> | undefined,
): PartialStateFactory<T> {
  const factory = useMemo(
    () => ({
      state,
      setState: setState ?? (() => {}),
    }),
    [state, setState],
  );

  return factory;
}

export type PartialStateTuple<T, F extends keyof T> = readonly [
  T[F],
  Dispatch<SetStateAction<T[F]>>,
];

export function usePartialState<T, F extends keyof T>(
  factory: PartialStateFactory<T>,
  property: F,
): PartialStateTuple<T, F> {
  const { state, setState } = factory;
  const propertyValue = state[property];
  const setProperty = useCallback(
    (valueOrUpdater: SetStateAction<T[F]>) => {
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
