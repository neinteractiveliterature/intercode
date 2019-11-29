import PropTypes from 'prop-types';

const humanFieldNames = {
  minimum_slots: 'Min',
  preferred_slots: 'Pref',
  total_slots: 'Max',
};

function checkFieldMinimums(object, targetField, sourceFields) {
  const currentValue = object[targetField];

  const errorField = sourceFields.find((sourceField) => currentValue < object[sourceField]);
  if (errorField) {
    if (currentValue == null) {
      return [`Please enter a value for ${humanFieldNames[targetField]}`];
    }

    return [
      `${humanFieldNames[targetField]} cannot be less than ${humanFieldNames[errorField]}`,
    ];
  }

  return [];
}

export function checkBucketFieldMinimums(bucket) {
  return [
    ...checkFieldMinimums(
      bucket,
      'preferred_slots',
      ['minimum_slots'],
    ),
    ...checkFieldMinimums(
      bucket,
      'total_slots',
      ['preferred_slots', 'minimum_slots'],
    ),
  ];
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
