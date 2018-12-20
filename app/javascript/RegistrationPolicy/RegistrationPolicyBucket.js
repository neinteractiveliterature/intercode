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

function checkBucketFieldMinimums(bucket, targetFields, minimumValue) {
  let newBucket = bucket;

  targetFields.forEach((targetField) => {
    if (newBucket[targetField] < minimumValue) {
      newBucket = { ...newBucket, [targetField]: minimumValue };
    }
  });

  return newBucket;
}

function setBucketMinimumSlots(bucket, newCount) {
  return checkBucketFieldMinimums(
    { ...bucket, minimum_slots: newCount },
    ['preferred_slots', 'total_slots'],
    newCount,
  );
}

function setBucketPreferredSlots(bucket, newCount) {
  return checkBucketFieldMinimums(
    { ...bucket, preferred_slots: newCount },
    ['total_slots'],
    newCount,
  );
}

export function setBucketProperty(bucket, field, value) {
  switch (field) {
    case 'slots_limited': return setBucketSlotsLimited(bucket, value);
    case 'minimum_slots': return setBucketMinimumSlots(bucket, value);
    case 'preferred_slots': return setBucketPreferredSlots(bucket, value);
    default: return { ...bucket, [field]: value };
  }
}

export function setBucketProperties(bucket, properties) {
  return Object.entries(properties).reduce(
    (newBucket, [field, value]) => setBucketProperty(newBucket, field, value),
    bucket,
  );
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
