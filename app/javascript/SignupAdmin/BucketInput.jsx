import React from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

const BucketInput = ({ signup, ...otherProps }) => {
  const bucketChoices = signup.run.event.registration_policy.buckets.map((bucket) => {
    const addenda = [];
    if (bucket.key === signup.bucket_key) {
      addenda.push('current');
    }
    if (bucket.key === signup.requested_bucket_key) {
      addenda.push('user requested');
    }
    const addendaString = (addenda.length > 0 ? ` (${addenda.join(', ')})` : '');

    const disabled = (
      bucket.key === signup.bucket_key ||
      (bucket.anything && signup.bucket_key)
    );

    return {
      value: bucket.key,
      label: `${bucket.name}${addendaString}`,
      disabled,
    };
  });

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
