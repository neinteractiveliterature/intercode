import React from 'react';
import PropTypes from 'prop-types';

const FieldRequiredFeedback = ({ valueInvalid }) => {
  if (!valueInvalid) {
    return null;
  }

  return (
    <div className="invalid-feedback">This field is required.</div>
  );
};

FieldRequiredFeedback.propTypes = {
  valueInvalid: PropTypes.bool.isRequired,
};

export default FieldRequiredFeedback;
