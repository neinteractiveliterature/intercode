export type RealIdObject<IdType> = { id: IdType };
export type GeneratedIdObject<IdType> = { generatedId: IdType };

export type WithGeneratedId<T, IdType> =
  T extends RealIdObject<IdType> ? Omit<T, 'id'> & GeneratedIdObject<IdType> : T & GeneratedIdObject<IdType>;

export type WithoutGeneratedId<T extends GeneratedIdObject<unknown>> = Omit<T, 'generatedId'>;

export type WithRealId<T extends GeneratedIdObject<IdType>, IdType> = Omit<T, 'generatedId'> & {
  id: IdType;
};

export type ArrayWithGeneratedIds<T, IdType> = T extends RealIdObject<IdType>[]
  ? WithGeneratedId<T[0], IdType>[]
  : T extends unknown[]
    ? (T[0] & GeneratedIdObject<IdType>)[]
    : never;

export type ArrayWithoutGeneratedIds<T, IdType> = T extends GeneratedIdObject<IdType>[]
  ? WithRealId<T[0], IdType>[]
  : never;

export type WithRealOrGeneratedId<T extends RealIdObject<IdType>, IdType> = T | WithGeneratedId<T, IdType>;

export function hasGeneratedId<T extends RealIdObject<IdType>, IdType>(
  value: WithRealOrGeneratedId<T, IdType>,
): value is WithGeneratedId<T, IdType> {
  return 'generatedId' in value && value.generatedId != null;
}

export function hasRealId<T extends RealIdObject<IdType>, IdType>(value: WithRealOrGeneratedId<T, IdType>): value is T {
  return 'id' in value && value.id != null;
}

export function getRealOrGeneratedId<T extends RealIdObject<IdType>, IdType>(
  value: WithRealOrGeneratedId<T, IdType>,
): IdType {
  if (hasRealId(value)) {
    return value.id;
  }

  return (value as WithGeneratedId<T, IdType>).generatedId;
}

export function realOrGeneratedIdsMatch<T extends RealIdObject<IdType>, IdType>(
  a: WithRealOrGeneratedId<T, IdType>,
  b: WithRealOrGeneratedId<T, IdType>,
): boolean {
  if (hasRealId(a) && hasRealId(b)) {
    return a.id === b.id;
  }

  if (hasGeneratedId(a) && hasGeneratedId(b)) {
    return a.generatedId === b.generatedId;
  }

  return false;
}
