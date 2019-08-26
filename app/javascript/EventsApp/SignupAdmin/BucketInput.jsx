import React from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';

function getLabelForBucketChoice(signup, bucket) {
  const addenda = [];
  if (bucket.key === signup.bucket_key) {
    addenda.push('current');
  }
  if (bucket.key === signup.requested_bucket_key) {
    addenda.push('user requested');
  }
  const addendaString = (addenda.length > 0 ? ` (${addenda.join(', ')})` : '');

  return `${bucket.name}${addendaString}`;
}

function shouldBucketChoiceBeDisabled(signup, bucket) {
  return (
    bucket.key === signup.bucket_key
    || (bucket.anything && signup.bucket_key)
  );
}

const BucketInput = ({ signup, ...otherProps }) => {
  const bucketChoices = signup.run.event.registration_policy.buckets.map((bucket) => ({
    value: bucket.key,
    label: getLabelForBucketChoice(signup, bucket),
    disabled: shouldBucketChoiceBeDisabled(signup, bucket),
  }));

  return (
    <MultipleChoiceInput
      choices={bucketChoices}
      {...otherProps}
    />
  );
};

BucketInput.propTypes = {
  signup: PropTypes.shape({
    run: PropTypes.shape({
      event: PropTypes.shape({
        registration_policy: PropTypes.shape({
          buckets: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    requested_bucket_key: PropTypes.string,
  }).isRequired,
};

export default BucketInput;
