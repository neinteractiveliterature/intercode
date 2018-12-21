import PropTypes from 'prop-types';

export function setBucketSlotsLimited(bucket, slotsLimited) {
  if (!slotsLimited) {
    return {
      ...bucket,
      slots_limited: false,
      total_slots: null,
      minimum_slots: null,
      preferred_slots: null,
    };
  }

  return { ...bucket, slots_limited: true };
}

function checkFieldMinimums(object, targetFields, minimumValue) {
  let newObject = object;

  targetFields.forEach((targetField) => {
    if (newObject[targetField] < minimumValue) {
      newObject = { ...newObject, [targetField]: minimumValue };
    }
  });

  return newObject;
}

function checkBucketFieldMinimums(bucket) {
  return checkFieldMinimums(
    checkFieldMinimums(
      bucket,
      ['preferred_slots', 'total_slots'],
      bucket.minimum_slots,
    ),
    ['total_slots'],
    bucket.preferred_slots,
  );
}

export function setBucketProperty(bucket, field, value) {
  switch (field) {
    case 'slots_limited': return setBucketSlotsLimited(bucket, value);
    case 'minimum_slots': return checkBucketFieldMinimums({ ...bucket, minimum_slots: value });
    case 'preferred_slots': return checkBucketFieldMinimums({ ...bucket, preferred_slots: value });
    default: return { ...bucket, [field]: value };
  }
}

export function setBucketProperties(bucket, properties) {
  return checkBucketFieldMinimums(Object.entries(properties).reduce(
    (newBucket, [field, value]) => ({ ...newBucket, [field]: value }),
    bucket,
  ));
}

export const RegistrationPolicyBucketPropType = PropTypes.shape({
  key: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  total_slots: PropTypes.number,
  minimum_slots: PropTypes.number,
  preferred_slots: PropTypes.number,
  slots_limited: PropTypes.bool,
  anything: PropTypes.bool,
  not_counted: PropTypes.bool,
  expose_attendees: PropTypes.bool,
});
