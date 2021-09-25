import { RegistrationPolicyBucket } from '../graphqlTypes.generated';

const humanFieldNames = {
  minimum_slots: 'Min',
  preferred_slots: 'Pref',
  total_slots: 'Max',
};

type CapacityField = 'minimum_slots' | 'preferred_slots' | 'total_slots';

type BucketType = Pick<RegistrationPolicyBucket, CapacityField>;

function checkFieldMinimums(
  object: BucketType,
  targetField: CapacityField,
  sourceFields: CapacityField[],
): string[] {
  const currentValue = object[targetField];

  const errorField = sourceFields.find((sourceField) => {
    if (currentValue == null) {
      return true;
    }

    const sourceValue = object[sourceField];
    if (sourceValue == null) {
      return false;
    }

    return currentValue < sourceValue;
  });

  if (errorField) {
    if (currentValue == null) {
      return [`Please enter a value for ${humanFieldNames[targetField]}`];
    }

    return [`${humanFieldNames[targetField]} cannot be less than ${humanFieldNames[errorField]}`];
  }

  return [];
}

export function checkBucketFieldMinimums(bucket: BucketType): string[] {
  return [
    ...checkFieldMinimums(bucket, 'preferred_slots', ['minimum_slots']),
    ...checkFieldMinimums(bucket, 'total_slots', ['preferred_slots', 'minimum_slots']),
  ];
}
