import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

export type PartialStateFactory<T> = {
  state: T;
  setState: Dispatch<(prevState: T) => T>;
};

export function usePartialStateFactoryWithValueSetter<T>(
  state: T,
  setState: Dispatch<T> | undefined,
): PartialStateFactory<T> {
  const factory: PartialStateFactory<T> = useMemo(
    () => ({
      state,
      setState: setState ? (updater: (prevState: T) => T) => setState(updater(state)) : () => {},
    }),
    [state, setState],
  );

  return factory;
}

export function usePartialStateFactory<T>(
  state: T,
  setState: Dispatch<(prevState: T) => T> | undefined,
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
  const calculateNewState = useCallback(
    (prevState: T, valueOrUpdater: SetStateAction<T[F]>): T => {
      if (typeof valueOrUpdater === 'function') {
        return {
          ...prevState,
          [property]: (valueOrUpdater as (prevState: T[F]) => T[F])(state[property]),
        };
      }

      return { ...prevState, [property]: valueOrUpdater };
    },
    [state, property],
  );

  const setProperty = useCallback(
    (valueOrUpdater: SetStateAction<T[F]>) => {
      setState((prevState) => calculateNewState(prevState, valueOrUpdater));
    },
    [calculateNewState, setState],
  );

  return [propertyValue, setProperty] as const;
}
